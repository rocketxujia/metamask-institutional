import { AccountHierarchyNode } from "../classes/AccountHierarchyNode";
import { ICustodianTransactionLink } from "@metamask-institutional/types";
import {
  IMetamaskContractMetadata,
  ITransactionDetails,
  IEIP1559TxParams,
  ILegacyTXParams,
  AuthDetails,
  AuthTypes,
  ISignatureDetails,
  IRefreshTokenAuthDetails 
} from "@metamask-institutional/types";
import { IEthereumAccount } from "./IEthereumAccount";
import { IEthereumAccountCustodianDetails } from "./IEthereumAccountCustodianDetails";
import { MessageTypes, TypedMessage } from "./ITypedMessage";
import { CreateTransactionMetadata } from "../types/CreateTransactionMetadata";
import { EventEmitter } from "events";

export interface CustodianApiConstructor {
  new (
    authDetails: AuthDetails,
    authType: AuthTypes,
    apiUrl: string,
    cacheAge: number
  ): ICustodianApi;
}

export interface ICustodianApi extends EventEmitter {
  integrationVersion: number;

  getAccountHierarchy(): Promise<AccountHierarchyNode>;

  getEthereumAccounts(
    chainId?: number
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]>;

  getEthereumAccountsByAddress(
    address: string,
    chainId?: number
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]>;

  getEthereumAccountsByLabelOrAddressName(
    name: string,
    chainId?: number
  ): Promise<IEthereumAccount<IEthereumAccountCustodianDetails>[]>;

  createTransaction(
    txParams: ILegacyTXParams | IEIP1559TxParams,
    txMeta: CreateTransactionMetadata
  ): Promise<ITransactionDetails>;

  getTransaction(
    from: string,
    transactionId: string
  ): Promise<ITransactionDetails>;

  getAllTransactions(): Promise<ITransactionDetails[]>;

  // Obtain a JWT from the custodian that we can use to authenticate to
  getCustomerProof(): Promise<string>;

  signTypedData_v4(
    address: string,
    buffer: TypedMessage<MessageTypes>,
    version: string
  ): Promise<ITransactionDetails>;

  signPersonalMessage(
    address: string,
    mesage: string
  ): Promise<ITransactionDetails>;

  getSupportedChains(address?: string): Promise<string[]>;

  getTransactionLink(
    transactionId: string
  ): Promise<Partial<ICustodianTransactionLink>>;

  getSignedMessage?(
    address: string,
    signatureId: string
  ): Promise<ISignatureDetails>;

  changeRefreshTokenAuthDetails(authDetails: IRefreshTokenAuthDetails): void;

  // Depcrecated

  getErc20Tokens(): Promise<IMetamaskContractMetadata>;

  getCustomerId(): Promise<string>;
}