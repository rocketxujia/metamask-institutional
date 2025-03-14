import { SimpleCache } from "@mm-institutional/simplecache";
import {
  AuthDetails,
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
import { JsonRpcReplaceTransactionParams } from "src/custodianApi/eca3/rpc-payloads/JsonRpcReplaceTransactionPayload";
import {
  JsonScwBuildTransactionPayload,
  JsonScwDelegatesPayload,
} from "src/custodianApi/json-api/rpc-payloads/JsonScwDelegatesPayload";
import { CustodianApiConstructor, ICustodianApi, IPortalCustodianApi } from "src/interfaces/ICustodianApi";
import { SignedMessageMetadata } from "src/types/SignedMessageMetadata";
import { SignedTypedMessageMetadata } from "src/types/SignedTypedMessageMetadata";

import { INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, REFRESH_TOKEN_CHANGE_EVENT } from "../constants/constants";
import { IEthereumAccount } from "../interfaces/IEthereumAccount";
import { IEthereumAccountCustodianDetails } from "../interfaces/IEthereumAccountCustodianDetails";
import { MessageTypes, TypedMessage } from "../interfaces/ITypedMessage";
import { CreateTransactionMetadata } from "../types/CreateTransactionMetadata";
import { AccountHierarchyNode } from "./AccountHierarchyNode";

export class MMISDK extends EventEmitter {
  custodianApi: IPortalCustodianApi | ICustodianApi;

  private cache = new SimpleCache();

  constructor(
    custodianApi: CustodianApiConstructor,
    authDetails: AuthDetails,
    authType: AuthTypes,
    apiUrl: string,
    private defaultCacheAgeSeconds = -1,
  ) {
    super();

    this.custodianApi = new custodianApi(authDetails, authType, apiUrl, defaultCacheAgeSeconds);

    // This event is "bottom up - from the custodian via the client".
    // Just bubble it up to to CustodyKeyring

    this.custodianApi.on(REFRESH_TOKEN_CHANGE_EVENT, event => {
      this.emit(REFRESH_TOKEN_CHANGE_EVENT, event);
    });

    this.custodianApi.on(INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, event => {
      this.emit(INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, event);
    });
  }

  // Do an in-situ replacement of the auth details
  public changeRefreshTokenAuthDetails(authDetails: IRefreshTokenAuthDetails): void {
    this.custodianApi.changeRefreshTokenAuthDetails(authDetails);
  }

  public getAccountHierarchy(): Promise<AccountHierarchyNode> {
    return this.custodianApi.getAccountHierarchy();
  }

  public async getListAccountsSigned(): Promise<string> {
    return this.custodianApi.getListAccountsSigned();
  }

  // Get ethereum accounts optionally based on the ID of the parent object
  public async getEthereumAccounts(
    maxCacheAgeSeconds = this.defaultCacheAgeSeconds,
    filterParams?: object,
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]> {
    const accounts = await this.custodianApi.getEthereumAccounts(null, filterParams || {});
    return accounts;
  }

  // Gets ethereum accounts based only on their address prefix
  public async getEthereumAccountsByAddress(
    address: string,
    maxCacheAgeSeconds = this.defaultCacheAgeSeconds,
    filterParams?: object,
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]> {
    const accounts = await this.custodianApi.getEthereumAccountsByAddress(address, null, filterParams || {});
    return accounts;
  }

  // Gets ethereum accounts based only on their labels prefix
  public async getEthereumAccountsByLabelOrAddressName(
    name: string,
    maxCacheAgeSeconds = this.defaultCacheAgeSeconds,
    filterParams?: object,
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]> {
    const accounts = await this.custodianApi.getEthereumAccountsByLabelOrAddressName(name, null, filterParams || {});
    return accounts;
  }

  public async getScwDelegates(
    txParams: IEIP1559TxParams | ILegacyTXParams,
    txMeta?: CreateTransactionMetadata,
  ): Promise<IPortalScwDelegates> {
    return (this.custodianApi as IPortalCustodianApi).getScwDelegates(txParams, txMeta);
  }

  public async buildScwTransaction(
    txParams: IEIP1559TxParams | ILegacyTXParams,
    txMeta?: CreateTransactionMetadata,
  ): Promise<IPortalScwBuildTransaction> {
    return (this.custodianApi as IPortalCustodianApi).buildScwTransaction(txParams, txMeta);
  }

  public async createTransaction(
    txParams: IEIP1559TxParams | ILegacyTXParams,
    txMeta?: CreateTransactionMetadata,
  ): Promise<ITransactionDetails> {
    const result = await this.custodianApi.createTransaction(txParams, txMeta);
    return result;
  }

  public async replaceTransaction(txParams: JsonRpcReplaceTransactionParams): Promise<{ transactionId: string }> {
    const result = await this.custodianApi.replaceTransaction(txParams);
    return result;
  }

  public getTransaction(from: string, transactionId: string): Promise<ITransactionDetails> {
    return this.custodianApi.getTransaction(from, transactionId);
  }

  public getAllTransactions(): Promise<ITransactionDetails[]> {
    return this.custodianApi.getAllTransactions();
  }

  public getCustomerId(): Promise<string> {
    return this.custodianApi.getCustomerId();
  }

  public async signedTypedData_v4(
    address: string,
    data: TypedMessage<MessageTypes>,
    version: string,
    signedTypedMessageMetadata: SignedTypedMessageMetadata,
  ): Promise<ITransactionDetails> {
    const result = await this.custodianApi.signTypedData_v4(address, data, version, signedTypedMessageMetadata);

    return result;
  }

  public async signPersonalMessage(
    address: string,
    message: string,
    signedMessageMetadata: SignedMessageMetadata,
  ): Promise<ITransactionDetails> {
    const result = await this.custodianApi.signPersonalMessage(address, message, signedMessageMetadata);

    return result;
  }

  // Calls getSignature by Id from the custodian API
  public async getSignature(address: string, signatureId: string): Promise<ISignatureDetails> {
    return this.custodianApi.getSignedMessage(address, signatureId);
  }

  public async getCustomerProof(): Promise<string> {
    return this.custodianApi.getCustomerProof();
  }

  public async getErc20Tokens(): Promise<IMetamaskContractMetadata> {
    return this.custodianApi.getErc20Tokens();
  }

  public async getSupportedChains(address: string): Promise<string[]> {
    return this.custodianApi.getSupportedChains(address);
  }

  public async getTransactionLink(transactionId: string): Promise<Partial<ICustodianTransactionLink>> {
    return this.custodianApi.getTransactionLink(transactionId);
  }
}

export { ICustodianDetails } from "../interfaces/ICustodianDetails";

// @TODO We don't need it right now, come back later after CustodyKeyring is in its own package
// and check if we still want to export it here for some reason
// export { CustodyKeyring } from "./CustodyKeyring";
