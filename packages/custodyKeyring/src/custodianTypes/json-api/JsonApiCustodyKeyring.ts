import { JsonPortalCustodianApi, MMISDK, mmiSDKFactory } from "@mm-institutional/sdk";
import {
  AddressType,
  AuthTypes,
  ICustodianTransactionLink,
  IRefreshTokenAuthDetails,
  ITransactionStatusMap,
} from "@mm-institutional/types";

import { CustodyKeyring } from "../../CustodyKeyring";
import { ICustodyKeyringOptions } from "../../interfaces/ICustodyKeyringOptions";
import { JsonRpcStatusMap } from "./JsonRpcStatusMap";

export class JsonApiCustodyKeyring extends CustodyKeyring {
  public static readonly type = "Custody - JSONAPI";
  public type = "Custody - JSONAPI";

  public authType = AuthTypes.REFRESH_TOKEN;

  public static addressType: AddressType.POLYCHAIN;

  public readonly custodianType = {
    name: "JSONAPI",
    displayName: "JSON-API",
    apiUrl: "",
    imgSrc: "",
    icon: "",
    website: "",
    onboardingUrl: "",
    envName: "portal-prod",
    keyringClass: JsonPortalCustodianApi,
    production: false,
    hidden: true, // Since this is the prototype, we don't want to show it in the UI
    origins: [],
    environmentMapping: [], // No environment mapping for JSON-RPC custodians as this is derived from the configuration service
  };

  sdkFactory = (authDetails: IRefreshTokenAuthDetails, envName: string): MMISDK => {
    const { refreshTokenUrl, apiUrl } = this.getCustodianFromEnvName(envName);

    authDetails.refreshTokenUrl = refreshTokenUrl;

    return mmiSDKFactory(JsonPortalCustodianApi, authDetails, this.authType, apiUrl);
  };

  txDeepLink = async (address: string, txId: string): Promise<Partial<ICustodianTransactionLink>> => {
    const { authDetails, envName } = this.getAccountDetails(address);

    const sdk = this.getSDK(authDetails, envName);

    try {
      const transactionLink = await sdk.getTransactionLink(txId);

      return transactionLink;
    } catch (e) {
      console.log(`Unable to get transction link for ${txId}`);
      return null;
    }
  };

  constructor(opts: ICustodyKeyringOptions = {}) {
    super(opts);
  }

  getStatusMap(): ITransactionStatusMap {
    return JsonRpcStatusMap;
  }
}
