import { CustodyKeyring } from "@mm-institutional/custody-keyring";
import { MmiConfigurationController } from "@mm-institutional/custody-keyring";

export class ITransactionUpdateControllerOptions {
  initState?: Record<string, unknown>;
  getCustodyKeyring?: (address: string) => Promise<CustodyKeyring>;
  mmiConfigurationController: MmiConfigurationController;
  captureException: (error: Error) => void;
}
