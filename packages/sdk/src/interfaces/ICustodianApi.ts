import { ICustodianTransactionLink, IPortalScwBuildTransaction, IPortalScwDelegates } from "@mm-institutional/types";
import {
  AuthDetails,
  AuthTypes,
  IEIP1559TxParams,
  ILegacyTXParams,
  IMetamaskContractMetadata,
  IRefreshTokenAuthDetails,
  ISignatureDetails,
  ITransactionDetails,
} from "@mm-institutional/types";
import { EventEmitter } from "events";
import { JsonRpcReplaceTransactionParams } from "src/custodianApi/eca3/rpc-payloads/JsonRpcReplaceTransactionPayload";
import { JsonRpcListAccountsSignedResponse } from "src/custodianApi/eca3/rpc-responses/JsonRpcListAccountsSignedResponse";
import {
  JsonScwBuildTransactionPayload,
  JsonScwDelegatesPayload,
} from "src/custodianApi/json-api/rpc-payloads/JsonScwDelegatesPayload";
import {
  JsonScwBuildTransactionResponse,
  JsonScwDelegatesResponse,
} from "src/custodianApi/json-api/rpc-responses/JsonScwDelegatesResponse";
import { SignedMessageMetadata } from "src/types/SignedMessageMetadata";
import { SignedMessageParams } from "src/types/SignedMessageParams";
import { SignedTypedMessageMetadata } from "src/types/SignedTypedMessageMetadata";
import { SignedTypedMessageParams } from "src/types/SignedTypedMessageParams";

import { AccountHierarchyNode } from "../classes/AccountHierarchyNode";
import { CreateTransactionMetadata } from "../types/CreateTransactionMetadata";
import { IEthereumAccount } from "./IEthereumAccount";
import { IEthereumAccountCustodianDetails } from "./IEthereumAccountCustodianDetails";
import { MessageTypes, TypedMessage } from "./ITypedMessage";

export interface CustodianApiConstructor {
  new (authDetails: AuthDetails, authType: AuthTypes, apiUrl: string, cacheAge: number): ICustodianApi;
}

export interface IPortalCustodianApi extends ICustodianApi {
  getScwDelegates(
    txParams: ILegacyTXParams | IEIP1559TxParams,
    txMeta: CreateTransactionMetadata,
  ): Promise<IPortalScwDelegates>;
  buildScwTransaction(
    txParams: ILegacyTXParams | IEIP1559TxParams,
    txMeta: CreateTransactionMetadata,
  ): Promise<IPortalScwBuildTransaction>;
}

export interface ICustodianApi extends EventEmitter {
  integrationVersion: number;

  getAccountHierarchy(): Promise<AccountHierarchyNode>;

  getListAccountsSigned?(): Promise<string>;

  getEthereumAccounts(
    chainId?: number,
    filterParams?: object,
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]>;

  getEthereumAccountsByAddress(
    address: string,
    chainId?: number,
    filterParams?: object,
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]>;

  getEthereumAccountsByLabelOrAddressName(
    name: string,
    chainId?: number,
    filterParams?: object,
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]>;

  createTransaction(
    txParams: ILegacyTXParams | IEIP1559TxParams,
    txMeta: CreateTransactionMetadata,
  ): Promise<ITransactionDetails>;

  replaceTransaction?(txParams: JsonRpcReplaceTransactionParams): Promise<{ transactionId: string }>;

  getTransaction(from: string, transactionId: string): Promise<ITransactionDetails>;

  getAllTransactions(): Promise<ITransactionDetails[]>;

  // Obtain a JWT from the custodian that we can use to authenticate to
  getCustomerProof(): Promise<string>;

  signTypedData_v4(
    address: string,
    data: TypedMessage<MessageTypes>,
    version: string,
    signedTypedMessageMetadata: SignedTypedMessageMetadata,
  ): Promise<ITransactionDetails>;

  signPersonalMessage(
    address: string,
    mesage: string,
    signedMessageMetadata: SignedMessageMetadata,
  ): Promise<ITransactionDetails>;

  getSupportedChains(address?: string): Promise<string[]>;

  getTransactionLink(transactionId: string): Promise<Partial<ICustodianTransactionLink>>;

  getSignedMessage?(address: string, signatureId: string): Promise<ISignatureDetails>;

  changeRefreshTokenAuthDetails(authDetails: IRefreshTokenAuthDetails): void;

  // Depcrecated

  getErc20Tokens(): Promise<IMetamaskContractMetadata>;

  getCustomerId(): Promise<string>;
}
