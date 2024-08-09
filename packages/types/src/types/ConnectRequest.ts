import { PortalWalletType } from "src/ICustodianAccount";

export type ConnectRequest = {
  channelId: string;
  traceId: string;
  token: string;
  environment: string;
  feature: string;
  service: string;
  portalWalletInfo?: PortalWalletType;
};
