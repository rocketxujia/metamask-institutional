import { MMISDK, mmiSDKFactory, QredoCustodianApi } from "@mm-institutional/sdk";
import {
  AddressType,
  AuthTypes,
  ICustodianTransactionLink,
  IRefreshTokenAuthDetails,
  ITransactionStatusMap,
} from "@mm-institutional/types";
import { ICustodianEnvironment } from "src/interfaces/ICustodianEnvironment";

import { CustodyKeyring } from "../../CustodyKeyring";
import { ICustodyKeyringOptions } from "../../interfaces/ICustodyKeyringOptions";
import { QredoStatusMap } from "./QredoStatusMap";

export class QredoCustodyKeyring extends CustodyKeyring {
  public static readonly type = "Custody - Qredo";
  public type = "Custody - Qredo";

  public readonly custodianType = {
    name: "Qredo",
    displayName: "Qredo",
    apiUrl: "https://api-v2.qredo.network/api/v2",
    imgSrc: "https://dashboard.metamask-institutional.io/custodian-icons/qredo-icon.svg",
    icon: "https://dashboard.metamask-institutional.io/custodian-icons/qredo-icon.svg",
    website: "https://www.qredo.com",
    onboardingUrl: "https://www.qredo.com",
    envName: "qredo",
    keyringClass: QredoCustodyKeyring,
    production: true,
    hidden: false,
    origins: [],
    environmentMapping: [
      {
        pattern: /^.*$/u,
        mmiApiUrl: "https://mmi.codefi.network/v1",
      },
      {
        pattern: /^https:\/\/api.qredo.network/u,
        mmiApiUrl: "https://api.mmi-prod.codefi.network/v1",
      },
    ],
  };

  public authType = AuthTypes.REFRESH_TOKEN;

  public static addressType: AddressType.POLYCHAIN;

  sdkFactory = (authDetails: IRefreshTokenAuthDetails, envName: string): MMISDK => {
    return mmiSDKFactory(QredoCustodianApi, authDetails, this.authType, this.custodianType.apiUrl);
  };

  txDeepLink = async (_address: string, _txId: string): Promise<Partial<ICustodianTransactionLink>> => {
    return null;
  };

  constructor(opts: ICustodyKeyringOptions = {}) {
    super(opts);
  }

  getStatusMap(): ITransactionStatusMap {
    return QredoStatusMap;
  }

  protected getCustodianFromEnvName(envName: string): ICustodianEnvironment {
    return this.getCustodians().find(c => /qredo/iu.test(c.envName));
  }
}
