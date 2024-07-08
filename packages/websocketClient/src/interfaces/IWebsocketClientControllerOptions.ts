import { CustodyKeyring, MmiConfigurationController } from "@mm-institutional/custody-keyring";
import { ConnectionRequest, ICustodianUpdate } from "@mm-institutional/types";

export class IWebsocketClientControllerOptions {
  initState?: Record<string, unknown>;
  getCustodyKeyring?: (address) => Promise<CustodyKeyring>;
  handleUpdateEvent?: (ev: ICustodianUpdate) => void;
  handleHandShakeEvent?: (ev: ICustodianUpdate) => void;
  handleConnectionRequest?: (ev: ConnectionRequest) => void;
  onFailure?: () => void;
  mmiConfigurationController: MmiConfigurationController;
  captureException: (error: Error) => void;
  onReconnect?: () => void;
  onWebsocketClose?: () => void;
}
