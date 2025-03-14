import { FeeMarketEIP1559Transaction, Transaction } from "@ethereumjs/tx";
import { toChecksumAddress } from "@ethereumjs/util";
import { MMISDK } from "@mm-institutional/sdk";
import {
  AddressType,
  AuthDetails,
  AuthTypes,
  ICustodianAccount,
  ICustodianTransactionLink,
  ICustodianType,
  IEIP1559TxParams,
  IExtensionCustodianAccount,
  IInteractiveRefreshTokenChangeEvent,
  ILegacyTXParams,
  IMetamaskContractMetadata,
  IPortalScwBuildTransaction,
  IPortalScwDelegates,
  IRefreshTokenAuthDetails,
  IRefreshTokenChangeEvent,
  ISignatureDetails,
  ITokenAuthDetails,
  ITransactionDetails,
  ITransactionStatusMap,
  MetamaskTransaction,
} from "@mm-institutional/types";
import crypto from "crypto";
import { EventEmitter } from "events";

import {
  DEFAULT_MAX_CACHE_AGE,
  INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT,
  REFRESH_TOKEN_CHANGE_EVENT,
} from "./constants";
import { ICustodianEnvironment } from "./interfaces/ICustodianEnvironment";
import { ICustodyKeyringOptions } from "./interfaces/ICustodyKeyringOptions";
import { ISerializedKeyring } from "./interfaces/ISerializedKeyring";
import { migrations } from "./migrations";
import { Migrator } from "./migrations/migrator";
import { MmiConfigurationController } from "./MmiConfiguration";

export type UniqueAccountDetails = {
  hash: string;
  authDetails: AuthDetails;
  envName: string;
  address: string;
};

export abstract class CustodyKeyring extends EventEmitter {
  public static readonly type;
  public readonly custodianType: ICustodianType; // A reference to the custodian configuration

  public authType: AuthTypes;

  public static addressType: AddressType;

  public type;
  public accounts;
  public selectedAddresses: ICustodianAccount[];
  public accountsDetails: ICustodianAccount[];
  public meta: { version?: number };
  public trackingActiveByCredentials = {};

  public mmiConfigurationController: MmiConfigurationController;
  public captureException: (error: Error) => void;
  public currentAddress: string;

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  abstract txDeepLink(custodianDetails: any, txId: string): Promise<Partial<ICustodianTransactionLink> | null>;

  abstract sdkFactory(authDetails: AuthDetails, envName: string): MMISDK;

  protected sdkList: { sdk: MMISDK; hash: string }[];

  constructor(opts: ICustodyKeyringOptions = {}) {
    super();
    this.accounts = [];
    this.selectedAddresses = [];
    this.accountsDetails = [];
    this.sdkList = [];
    this.meta = {};
    this.mmiConfigurationController = opts.mmiConfigurationController;
    this.captureException = opts.captureException;
    this.currentAddress = "";
  }

  getUniqueAccountDetails(account: ICustodianAccount<AuthDetails>): string {
    return this.hashAuthDetails(account.authDetails, account.envName, account.address);
  }

  serialize(): Promise<ISerializedKeyring> {
    console.log("Serializing custody keyring");
    return Promise.resolve({
      accounts: this.accounts,
      selectedAddresses: this.selectedAddresses,
      accountsDetails: this.accountsDetails,
      meta: this.meta,
    });
  }

  deserialize(
    opts: {
      accounts?: string[];
      selectedAddresses?: ICustodianAccount[];
      accountsDetails?: ICustodianAccount[];
      meta?: { version?: number };
    } = {},
  ): Promise<void> {
    return new Promise<void>(resolve => {
      try {
        const migrator = new Migrator({ migrations });
        const migratedOpts = migrator.migrateData({
          custodianType: this.custodianType,
          type: this.type,
          authType: this.authType,
          ...opts,
        });
        this.accounts = migratedOpts.accounts || [];
        this.selectedAddresses = migratedOpts.selectedAddresses || [];
        this.accountsDetails = migratedOpts.accountsDetails || [];
        this.meta = migratedOpts.meta || {};

        // BEGIN UPDATE ACCOUNTS WITH ENV NAME
        const custodians = this.getCustodians();
        this.accountsDetails
          .filter(account => !account.envName)
          .forEach(account => {
            account.envName = custodians.find(c => c.apiUrl === account.apiUrl)?.envName;
          });

        this.selectedAddresses
          .filter(account => !account.envName)
          .forEach(account => {
            account.envName = custodians.find(c => c.apiUrl === account.apiUrl)?.envName;
          });
        // ENV UPDATE ACCOUNTS WITH ENV NAME

        const uniqueAuthDetails: UniqueAccountDetails[] = this.accountsDetails.reduce(
          (result: UniqueAccountDetails[], details) => {
            const hash = this.getUniqueAccountDetails(details);
            if (!result.find(account => hash === account.hash)) {
              result.push({
                hash,
                authDetails: details.authDetails,
                envName: details.envName,
                address: details.address,
              });
            }
            return result;
          },
          [],
        );
        uniqueAuthDetails.forEach(item => this.getSDK(item.authDetails, item.envName, item.address));

        resolve();
      } catch (error) {
        console.error("Error during deserialize method execution:", error);
        this.captureException(error);
      }
    });
  }

  convertExtensionCustodianAccountToSDKCustodianAccount(account: IExtensionCustodianAccount): ICustodianAccount {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { token, ...accountWithoutToken } = account;
    return {
      ...accountWithoutToken,
      address: account.address.toLowerCase(),
      authDetails: this.createAuthDetails(account.token),
    };
  }

  setSelectedAddresses(addresses: IExtensionCustodianAccount[]): void {
    // MMI is agnostic to authType, so it sends
    // from the Custody Compoment (via MetaMaskController.connectCustodyAddresses)
    // a neutral "token" value which we turn into authDetails

    // This will need to be fixed to properly support Authorization Code Flow

    this.selectedAddresses = addresses.map(this.convertExtensionCustodianAccountToSDKCustodianAccount.bind(this));
  }

  addAccounts(n: number): Promise<void> {
    return new Promise(resolve => {
      if (!this.accounts) this.accounts = [];
      for (let i = 0; i < n; i++) {
        const selectedAccountDetails = this.selectedAddresses.shift();
        const address = selectedAccountDetails?.address;
        if (address && !this.accounts.includes(address)) {
          selectedAccountDetails.meta = { version: migrations.length };
          this.accountsDetails.push(selectedAccountDetails);
          this.accounts.push(address);

          // Ensure the SDK is available as soon as the account is added
          this.getSDK(selectedAccountDetails.authDetails, selectedAccountDetails.envName, address);
        }
      }
      resolve(this.accounts);
    });
  }

  getAccounts() {
    return Promise.resolve(this.accounts.slice());
  }

  removeAccount(address: string): void {
    this.accounts = this.accounts.filter(a => a.toLowerCase() !== address.toLowerCase());
    this.accountsDetails = this.accountsDetails.filter(a => a.address.toLowerCase() !== address.toLowerCase());
  }

  hashAuthDetails(authDetails: AuthDetails, envName: string, address: string): string {
    address = (address || "").toLowerCase();
    const identifier = `${envName}_${address}`;
    const hash = crypto.createHash("sha256").update(identifier).digest("hex");
    console.log(
      "[CustodyKeyring.hashAuthDetails] generating auth details hash. identifier",
      identifier,
      ", hash:",
      hash,
    );
    return hash;
  }

  // This is for "top-down" token refreshes (from the extension)
  // This allows the API URL to be changed
  replaceRefreshTokenAuthDetails(address: string, refreshToken: string): void {
    const { authDetails, envName } = this.getAccountDetails(address);
    const sdk = this.getSDK(authDetails, envName, address);
    this.currentAddress = address;
    sdk.changeRefreshTokenAuthDetails({
      refreshToken,
    });
  }

  updateAccountsDetailsWithNewRefreshToken(oldRefreshToken: string, newRefreshToken: string, envName: string) {
    const currentAddress = this.currentAddress;
    // 更新已绑定账户列表内地址对应保存的 refreshToken
    for (const account of this.accountsDetails) {
      const authDetails = account.authDetails as IRefreshTokenAuthDetails;
      if ((authDetails as IRefreshTokenAuthDetails).refreshToken === oldRefreshToken && account.envName === envName) {
        authDetails.refreshToken = newRefreshToken;
        console.log("[CustodyKeyring] Update Custody Keyring accounts details with new refresh token");
        // 删除已绑定账户的 SDK 对象，因为内部保存着过期的 refreshToken。 除非是当前地址。
        if (account.address !== currentAddress) {
          const oldHash = this.hashAuthDetails(authDetails, envName, account.address);
          const found = this.sdkList.find(item => item.hash === oldHash);
          if (found) {
            this.sdkList = this.sdkList.filter(item => item.hash !== oldHash);
            console.log(
              "[CustodyKeyring] Delete SDK with the same old refreshToken from other Address. ",
              account.address,
            );
          }
        }
      }
    }
  }

  handleRefreshTokenChangeEvent(event: IRefreshTokenChangeEvent, envName: string): void {
    this.updateAccountsDetailsWithNewRefreshToken(event.oldRefreshToken, event.newRefreshToken, envName);

    const payload: IRefreshTokenChangeEvent = {
      oldRefreshToken: event.oldRefreshToken,
      newRefreshToken: event.newRefreshToken,
    };

    this.emit(REFRESH_TOKEN_CHANGE_EVENT, payload); // 发送到 mmi-controller 暂存 payload
  }

  handleInteractiveRefreshTokenChangeEvent(event: IInteractiveRefreshTokenChangeEvent): void {
    this.emit(INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, event); // Propagate the event to the extension where it calls for the keyrings to be persisted
  }

  createAuthDetails(token: string): AuthDetails {
    let authDetails: AuthDetails;

    if (this.authType === AuthTypes.TOKEN) {
      authDetails = {
        jwt: token,
      };
    } else if (this.authType === AuthTypes.REFRESH_TOKEN) {
      authDetails = {
        refreshToken: token,
      };
    }

    return authDetails;
  }

  getSDK(authDetails: AuthDetails, envName: string, address: string): MMISDK {
    const hash = this.hashAuthDetails(authDetails, envName, address);
    const found = this.sdkList.find(item => item.hash === hash);
    if (found) {
      console.log("[CustodyKeyring.getSDK] Found existing SDK. hash:", hash);
      return found.sdk;
    }
    const sdk = this.sdkFactory(authDetails, envName);
    sdk.on(REFRESH_TOKEN_CHANGE_EVENT, (event: IRefreshTokenChangeEvent) =>
      this.handleRefreshTokenChangeEvent(event, envName),
    );
    sdk.on(INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, (event: IInteractiveRefreshTokenChangeEvent) =>
      this.handleInteractiveRefreshTokenChangeEvent(event),
    );
    // 没地址代表导入阶段，无需保存；
    if (address) {
      this.sdkList.push({
        sdk,
        hash,
      });
    }
    console.log(
      "[CustodyKeyring.getSDK] Create new SDK with auth details hash. envName:",
      envName,
      ", address:",
      address,
      ", this.sdkList: ",
      this.sdkList.map(item => item.hash),
    );
    return sdk;
  }

  async getCustodianAccounts(
    token: string,
    envName: string,
    searchText?: string,
    getNonImportedAccounts = true,
    filterParams?: object,
  ): Promise<ICustodianAccount<AuthDetails>[]> {
    const authDetails = this.createAuthDetails(token);
    const sdkForImport = this.getSDK(authDetails, envName, "");

    let accounts;
    if (searchText) {
      if (searchText.startsWith("0x")) {
        accounts = await sdkForImport.getEthereumAccountsByAddress(searchText, DEFAULT_MAX_CACHE_AGE, filterParams);
      } else {
        accounts = await sdkForImport.getEthereumAccountsByLabelOrAddressName(
          searchText,
          DEFAULT_MAX_CACHE_AGE,
          filterParams,
        );
      }
    } else {
      accounts = await sdkForImport.getEthereumAccounts(DEFAULT_MAX_CACHE_AGE, filterParams);
    }

    if (getNonImportedAccounts) {
      return accounts.filter(
        account => this.accounts.map(addr => addr.toLowerCase()).indexOf(account.address.toLowerCase()) === -1,
      );
    }

    return accounts.filter(
      account => this.accounts.map(addr => addr.toLowerCase()).indexOf(account.address.toLowerCase()) !== -1,
    );
  }

  getTransactionNote(txMeta: MetamaskTransaction): string {
    const mapping = {
      contractInteraction: "Contract Interaction",
      contractDeployment: "Contract Deployment",
      transfer: "ETH Transfer",
      swap: "Metamask Swap",
      approve: "Token Approval",
    };

    const readableCategory = mapping[txMeta.type] || txMeta.type;

    return txMeta?.metadata?.note || `${readableCategory} - initiated on ${txMeta.origin}`;
  }

  async getScwDelegates(
    txParams: { from: string; to: string; value: string; data: string },
    txMeta: { chainId: string },
  ): Promise<IPortalScwDelegates> {
    let data: any;
    if (typeof txParams.data === "string") {
      data = txParams.data;
    }
    if (!data?.length) {
      data = undefined;
    } else if (!data?.startsWith("0x")) {
      data = "0x" + data;
    }
    const fromAddress = txParams.from;
    const { authDetails, envName } = this.getAccountDetails(fromAddress);
    const sdk = this.getSDK(authDetails, envName, fromAddress);
    this.currentAddress = fromAddress;

    const noGasPayload: any = {
      from: toChecksumAddress(fromAddress),
      value: BigInt(txParams.value).toString(),
      data: data,
    };

    // Contract deployments have no to address
    if (txParams.to) {
      noGasPayload.to = toChecksumAddress(txParams.to);
    }
    const payload: IEIP1559TxParams | ILegacyTXParams = noGasPayload;
    const chainId = Number(txMeta.chainId).toString(10); // Convert to string to avoid weirdness with BigInt

    const result = await sdk.getScwDelegates(payload, {
      chainId,
    });
    return result;
  }

  async buildScwTransaction(
    txParams: { delegateAddress: string; from: string; to: string; value: string; data: string },
    txMeta: { chainId: string },
  ): Promise<IPortalScwBuildTransaction> {
    let data: any;
    if (typeof txParams.data === "string") {
      data = txParams.data;
    }
    if (!data?.length) {
      data = undefined;
    } else if (!data?.startsWith("0x")) {
      data = "0x" + data;
    }

    const fromAddress = txParams.from;
    const { authDetails, envName } = this.getAccountDetails(fromAddress);
    const sdk = this.getSDK(authDetails, envName, fromAddress);
    this.currentAddress = fromAddress;

    const noGasPayload: any = {
      delegateAddress: toChecksumAddress(txParams.delegateAddress),
      from: toChecksumAddress(fromAddress),
      value: BigInt(txParams.value).toString(),
      data: data,
    };

    // Contract deployments have no to address
    if (txParams.to) {
      noGasPayload.to = toChecksumAddress(txParams.to);
    }
    const payload: IEIP1559TxParams | ILegacyTXParams = noGasPayload;
    const chainId = Number(txMeta.chainId).toString(10); // Convert to string to avoid weirdness with BigInt

    const result = await sdk.buildScwTransaction(payload, {
      chainId,
    });
    return result;
  }

  // tx is an instance of the ethereumjs-transaction class.
  async signTransaction(
    fromAddress: string,
    ethTx: FeeMarketEIP1559Transaction | Transaction,
    txMeta: MetamaskTransaction,
  ): Promise<ITransactionDetails> {
    const note = this.getTransactionNote(txMeta);

    let data: any;
    if (typeof ethTx.data === "string") {
      data = ethTx.data;
    } else if (ethTx.data instanceof Uint8Array) {
      data = ethTx.data.toString("hex");
    }

    if (!data?.length) {
      data = undefined;
    } else if (!data?.startsWith("0x")) {
      data = "0x" + data;
    }

    const { authDetails, envName } = this.getAccountDetails(fromAddress);
    const sdk = this.getSDK(authDetails, envName, fromAddress);
    this.currentAddress = fromAddress;

    const noGasPayload: any = {
      from: toChecksumAddress(fromAddress),
      value: BigInt(txMeta.txParams.value).toString(),
      gasLimit: BigInt(txMeta.txParams.gas).toString(),
      data: data,
    };

    // Contract deployments have no to address
    if (txMeta.txParams.to) {
      noGasPayload.to = toChecksumAddress(txMeta.txParams.to);
    }

    const eip1559 = (txMeta.txParams as IEIP1559TxParams).maxFeePerGas;

    const chainId = Number(txMeta.chainId).toString(10); // Convert to string to avoid weirdness with BigInt

    let payload: IEIP1559TxParams | ILegacyTXParams;

    if (eip1559) {
      payload = {
        ...noGasPayload,
        maxFeePerGas: BigInt((txMeta.txParams as IEIP1559TxParams).maxFeePerGas).toString(),
        maxPriorityFeePerGas: BigInt((txMeta.txParams as IEIP1559TxParams).maxPriorityFeePerGas).toString(),
        type: "2",
      } as IEIP1559TxParams;
    } else {
      payload = {
        ...noGasPayload,
        gasPrice: BigInt((txMeta.txParams as ILegacyTXParams).gasPrice).toString(),
        type: "0",
      } as ILegacyTXParams;
    }

    // portal scw need to add delegate address
    if (txMeta.delegateAddress) {
      payload.delegateAddress = txMeta.delegateAddress;
    }

    const result = await sdk.createTransaction(payload, {
      chainId,
      note,
      transactionCategory: txMeta.type,
      origin: txMeta.origin,
      custodianPublishesTransaction: txMeta?.metadata?.custodianPublishesTransaction,
      rpcUrl: txMeta?.metadata?.rpcUrl,
    });

    return result;
  }

  getAllAccountsWithToken(token: string): ICustodianAccount[] {
    return this.accountsDetails.filter(
      item =>
        (item.authDetails as ITokenAuthDetails)?.jwt === token ||
        (item.authDetails as IRefreshTokenAuthDetails)?.refreshToken === token,
    );
  }

  async getTransaction(from: string, txCustodyId: string): Promise<ITransactionDetails> {
    if (from === undefined || txCustodyId === undefined) {
      return null;
    }

    const { authDetails, envName } = this.getAccountDetails(from);
    const sdk = this.getSDK(authDetails, envName, from);
    this.currentAddress = from;
    const tx = await sdk.getTransaction(toChecksumAddress(from), txCustodyId);
    return tx;
  }

  async getTransactionDeepLink(address: string, txId: string): Promise<Partial<ICustodianTransactionLink>> {
    return this.txDeepLink(address, txId);
  }

  getAccountDetails(address: string): ICustodianAccount {
    return this.accountsDetails.find(account => account.address.toLowerCase() === address.toLowerCase());
  }

  // TODO: This methods should be rename 'get signed message'

  async getSignature(address: string, signatureId: string): Promise<ISignatureDetails> {
    if (signatureId === undefined) {
      return null;
    }

    const { authDetails, envName } = this.getAccountDetails(address);
    const sdk = this.getSDK(authDetails, envName, address);
    this.currentAddress = address;

    const signature = await sdk.getSignature(toChecksumAddress(address), signatureId);

    return signature;
  }

  async signPersonalMessage(address: string, message: string, opts: any): Promise<ITransactionDetails> {
    const { authDetails, envName } = this.getAccountDetails(address);
    const sdk = this.getSDK(authDetails, envName, address);
    this.currentAddress = address;

    const signedMessageMetadata = {
      chainId: null,
      originUrl: null,
      note: null,
    };

    return sdk.signPersonalMessage(address, message, signedMessageMetadata);
  }

  signMessage() {
    throw new Error("Not supported on this custodian");
  }

  exportAccount() {
    throw new Error("Not supported on this custodian");
  }

  async getErc20Tokens(): Promise<IMetamaskContractMetadata> {
    let tokenContracts = {};

    for (const { sdk } of this.sdkList) {
      const tokens = await sdk.getErc20Tokens();
      tokenContracts = { ...tokenContracts, tokens };
    }

    return tokenContracts;
  }

  abstract getStatusMap(): ITransactionStatusMap;

  async getCustomerProof(address: string): Promise<string> {
    const { authDetails, envName } = this.getAccountDetails(address);
    const sdk = this.getSDK(authDetails, envName, address);
    this.currentAddress = address;

    return sdk.getCustomerProof();
  }

  async signTypedData(address: string, data: any, opts: any): Promise<ITransactionDetails> {
    // Explanation : signTypedDataV4 also works for V3 (the standard is backward compatible)
    // However, the custodian will treat it as V4, so we continue to name the SDK methods V4
    if (opts?.version !== "V4" && opts?.version !== "V3") {
      this.emit("error", "Only signedTypedData_v4 and signedTypedData_v3 is supported");
    }

    const { authDetails, envName } = this.getAccountDetails(address);
    const sdk = this.getSDK(authDetails, envName, address);
    this.currentAddress = address;

    const signedTypedMessageMetadata = {
      chainId: null,
      originUrl: null,
      note: null,
    };

    return sdk.signedTypedData_v4(address, data, opts.version, signedTypedMessageMetadata);
  }

  getSupportedChains(address: string): Promise<string[]> {
    const { authDetails, envName } = this.getAccountDetails(address);
    const sdk = this.getSDK(authDetails, envName, address);
    this.currentAddress = address;
    return sdk.getSupportedChains(address);
  }

  protected getCustodianFromEnvName(envName: string) {
    if (!envName) {
      return;
    }

    const custodian = this.getCustodians().find(c => c.envName === envName);

    if (!custodian) {
      throw new Error(`Could not find custodian with name: ${envName} - please contact support`);
    }

    return custodian;
  }

  protected getCustodians(): ICustodianEnvironment[] {
    const {
      mmiConfiguration: { custodians },
    } = this.mmiConfigurationController.store.getState();

    return custodians;
  }
}
