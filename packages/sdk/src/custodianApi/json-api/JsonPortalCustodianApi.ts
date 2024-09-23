import { SimpleCache } from "@mm-institutional/simplecache";
import {
  AuthTypes,
  ICustodianTransactionLink,
  IEIP1559TxParams,
  ILegacyTXParams,
  IMetamaskContractMetadata,
  IPortalScwBuildTransaction,
  IPortalScwDelegates,
  IRefreshTokenAuthDetails,
  ISignatureDetails,
  ITransactionDetails,
} from "@mm-institutional/types";
import { EventEmitter } from "events";

import { AccountHierarchyNode } from "../../classes/AccountHierarchyNode";
import { INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, REFRESH_TOKEN_CHANGE_EVENT } from "../../constants/constants";
import { IPortalCustodianApi } from "../../interfaces/ICustodianApi";
import { IEthereumAccount } from "../../interfaces/IEthereumAccount";
import { IEthereumAccountCustodianDetails } from "../../interfaces/IEthereumAccountCustodianDetails";
import { MessageTypes, TypedMessage } from "../../interfaces/ITypedMessage";
import { CreateTransactionMetadata } from "../../types/CreateTransactionMetadata";
import { hexlify } from "../json-rpc/util/hexlify";
import { JsonApiTransactionParams } from ".//rpc-payloads/JsonRpcCreateTransactionPayload";
import { mapStatusObjectToStatusText } from ".//util/mapStatusObjectToStatusText";
import { JsonPortalClient } from "./JsonPortalClient";
import { JsonScwBuildTransactionPayload, JsonScwDelegatesPayload } from "./rpc-payloads/JsonScwDelegatesPayload";
import { JsonScwBuildTransactionResponse, JsonScwDelegatesResponse } from "./rpc-responses/JsonScwDelegatesResponse";

export class JsonPortalCustodianApi extends EventEmitter implements IPortalCustodianApi {
  private client: JsonPortalClient;
  private cache = new SimpleCache();

  public integrationVersion = 2;

  constructor(
    authDetails: IRefreshTokenAuthDetails,
    _authType: AuthTypes,
    apiBaseUrl: string,
    private readonly cacheAge: number,
  ) {
    super();
    const { refreshToken } = authDetails;
    this.client = new JsonPortalClient(apiBaseUrl, refreshToken, authDetails.refreshTokenUrl);

    // This event is "bottom up" - from the custodian via the client.
    // Just bubble it up to MMISDK

    this.client.on(REFRESH_TOKEN_CHANGE_EVENT, event => {
      this.emit(REFRESH_TOKEN_CHANGE_EVENT, event);
    });

    this.client.on(INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, event => {
      this.emit(INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, event);
    });
  }

  getAccountHierarchy(): Promise<AccountHierarchyNode> {
    return null;
  }

  async getEthereumAccounts(
    chainId?: number,
    filterParams?: object,
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]> {
    const accounts = await this.client.listAccounts(filterParams);

    const mappedAccounts = accounts.result.map(account => ({
      name: account.name,
      address: account.address,
      custodianDetails: null,
      labels: account.tags.map(tag => ({ key: tag.name, value: tag.value })),
      walletType: account.wallet_type || "Unknown",
      walletId: account.wallet_id,
    }));

    return mappedAccounts;
  }

  async getEthereumAccountsByAddress(
    address: string,
    chainId?: number,
    filterParams?: object,
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]> {
    const accounts = await this.getEthereumAccounts(chainId, filterParams);

    // TODO: This is a bit inefficient, but eventually we may add optional filtering to the JSON-RPC API

    return accounts.filter(account => account.address.toLowerCase().includes(address.toLowerCase()));
  }

  async getEthereumAccountsByLabelOrAddressName(
    name: string,
    chainId?: number,
    filterParams?: object,
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]> {
    const accounts = await this.getEthereumAccounts(chainId, filterParams);
    return accounts.filter(account => account.name.includes(name));
  }

  // call getScwDelegates
  async getScwDelegates(
    txParams: IEIP1559TxParams | ILegacyTXParams,
    txMeta: CreateTransactionMetadata,
  ): Promise<IPortalScwDelegates> {
    const payload: JsonScwDelegatesPayload = {
      wallet_address: txParams.from, // already hexlified
      to_address: txParams.to, // already hexlified
      data: txParams.data, // already hexlified
      value: hexlify(txParams.value),
      chain_id: hexlify(txMeta.chainId),
    };

    const { result } = await this.client.getScwDelegates(payload);
    return result.delegates.map(delegate => {
      return {
        name: delegate.name,
        address: delegate.address,
        labels: (delegate.tags || []).map(t => {
          return {
            key: t.name as string,
            value: t.value as string,
          };
        }),
        gasBalance: delegate.gas_balance,
      };
    });
  }

  // buildTransaction
  async buildScwTransaction(
    txParams: IEIP1559TxParams | ILegacyTXParams,
    txMeta: CreateTransactionMetadata,
  ): Promise<IPortalScwBuildTransaction> {
    const payload: JsonScwBuildTransactionPayload = {
      wallet_address: txParams.from, // already hexlified
      to_address: txParams.to, // already hexlified
      data: txParams.data, // already hexlified
      value: hexlify(txParams.value),
      chain_id: hexlify(txMeta.chainId),
      delegate_address: txParams.delegateAddress,
    };

    const { result } = await this.client.buildScwTransaction(payload);
    return {
      data: result.data,
      fromAddress: result.from_address,
      toAddress: result.to_address,
      value: result.value,
    };
  }

  async createTransaction(
    txParams: IEIP1559TxParams | ILegacyTXParams,
    txMeta: CreateTransactionMetadata,
  ): Promise<ITransactionDetails> {
    // const fromAddress = txParams.from;
    // const accounts = await this.getEthereumAccountsByAddress(fromAddress);
    // if (!accounts.length) {
    //   throw new Error("No such ethereum account!");
    // }

    const payload: Partial<JsonApiTransactionParams> = {
      from_address: txParams.from, // already hexlified
      to_address: txParams.to, // already hexlified
      data: txParams.data, // already hexlified
      value: hexlify(txParams.value),
      tx_type: hexlify(txParams.type),
      chain_id: hexlify(txMeta.chainId),
      note: txMeta.note,
      origin_url: txMeta.origin,
      category: txMeta.transactionCategory,
    };

    if (txParams.delegateAddress) {
      payload.delegate_address = txParams.delegateAddress;
    }

    if (Number(txParams.type) === 2) {
      payload.fee = {
        gas_limit: hexlify(txParams.gasLimit),
        max_fee: hexlify((txParams as IEIP1559TxParams).maxFeePerGas),
        max_priority_fee: hexlify((txParams as IEIP1559TxParams).maxFeePerGas),
      };
    } else {
      payload.fee = {
        gas_limit: hexlify(txParams.gasLimit),
        gas_price: hexlify((txParams as ILegacyTXParams).gasPrice),
      };
    }

    const { result } = await this.client.createTransaction(payload as JsonApiTransactionParams);

    return {
      custodian_transactionId: result.tx_id,
      transactionStatus: "created",
      from: txParams.from,
      // Portal 属性
      custodianRequestId: result.request_id,
    };
  }

  async getTransaction(_from: string, custodian_transactionId: string): Promise<ITransactionDetails> {
    const { result } = await this.client.getTransaction(custodian_transactionId);
    if (!result) {
      return null;
    }
    // delegateAccount 转换命名
    const delegate = result.delegate;
    let delegateAccount = undefined;
    if (delegate && delegate.address) {
      delegateAccount = {
        name: delegate.name,
        address: delegate.address,
        labels: (delegate.tags || []).map(t => {
          return {
            key: t.name as string,
            value: t.value as string,
          };
        }),
        gasBalance: delegate.gas_balance,
      };
    }
    return {
      custodian_transactionId: result.id,
      transactionStatus: mapStatusObjectToStatusText(result.timeline),
      transactionStatusDisplayText: result.timeline?.displayText,
      from: result.from_address,
      gasLimit: result.gas_limit || "",
      gasPrice: result.gas_price || "",
      maxFeePerGas: result.max_fee || "",
      maxPriorityFeePerGas: result.max_priority_fee || "",
      nonce: result.nonce,
      transactionHash: result.hash,
      reason: result.timeline.reason,
      to: result.to_address,
      // Portal 属性
      custodianRequestId: result.request_id,
      custodianStatusReason: result.timeline.reason,
      delegateAccount,
    };
  }

  // Gets a Signed Message by Id and returns relevant data
  async getSignedMessage(_address: string, custodian_signedMessageId: string): Promise<ISignatureDetails> {
    const { result } = await this.client.getSignedMessage(custodian_signedMessageId);

    if (!result) {
      return null;
    }

    return {
      signature: result.signature,
      status: result.timeline,
    };
  }

  async getTransactionLink(transactionId: string): Promise<Partial<ICustodianTransactionLink>> {
    return null;
  }

  // DEPRECATED
  async getCustomerId(): Promise<string> {
    return null;
  }

  // DEPRECATED
  async getAllTransactions(): Promise<ITransactionDetails[]> {
    // This is no longer a required part of the custodian API
    return null;
  }

  // Obtain a JWT from the custodian that we can use to authenticate to
  public async getCustomerProof(): Promise<string> {
    const { result } = await this.client.getCustomerProof();
    return result.jwt;
  }

  async signTypedData_v4(
    address: string,
    message: TypedMessage<MessageTypes>,
    version: string,
  ): Promise<ITransactionDetails> {
    const accounts = await this.getEthereumAccountsByAddress(address);

    if (!accounts.length) {
      throw new Error("No such ethereum account!");
    }

    version = version.toLowerCase();

    // const { result } = await this.client.signTypedData([address, message, version]);
    const { result } = await this.client.signTypedData({
      signing_address: address,
      payload: JSON.stringify(message),
      message_type: "EIP712",
      encoding_version: "v3",
    });

    return {
      custodian_transactionId: result.msg_id,
      transactionStatus: "created",
      from: address,
    };
  }

  async signPersonalMessage(address: string, message: string): Promise<ITransactionDetails> {
    const accounts = await this.getEthereumAccountsByAddress(address);

    if (!accounts.length) {
      throw new Error("No such ethereum account!");
    }

    const { result } = await this.client.signPersonalMessage({
      signing_address: address,
      payload: message,
      message_type: "EIP191",
    });

    return {
      custodian_transactionId: result.msg_id,
      transactionStatus: "created",
      from: accounts[0].address,
    };
  }

  // DEPRECATED
  async getErc20Tokens(): Promise<IMetamaskContractMetadata> {
    return {};
  }

  async getSupportedChains(address: string): Promise<string[]> {
    return this.cache.tryCachingArray<string>("getSupportedChains-" + address, this.cacheAge, async () => {
      const { result } = await this.client.getAccountChainIds({ address });
      return result;
    });
  }

  changeRefreshTokenAuthDetails(authDetails: IRefreshTokenAuthDetails): void {
    this.client.setRefreshToken(authDetails.refreshToken);
  }
}
