import { AuthDetails } from "./types/AuthDetails";

// 钱包类型，规范值有：  "MPC", "SmartContract", "Custodial", "Exchange" 等
enum PortalWalletType {
  MPC = "MPC",
  SmartContract = "SmartContract",
  Custodial = "Custodial",
  Exchange = "Exchange",
}

interface Label {
  key: string;
  value: string;
}

// This is a horrible mess
interface ICustodianAccountProto {
  name?: string;
  address: string;
  custodianDetails: any;
  labels: Label[];
  walletId?: string;
  walletType?: PortalWalletType;
  /** @deprecated */
  apiUrl: string;
  chainId?: number;
  custodyType: string;
  meta?: { version: number };
  envName: string;
}

// The type actually used in CustodyKeyring

export interface ICustodianAccount<T extends AuthDetails = AuthDetails> extends ICustodianAccountProto {
  authDetails: T;
}

// The type that's used in the extension, which is agnostic to authType

export interface IExtensionCustodianAccount extends ICustodianAccountProto {
  token: string; // TODO
}
