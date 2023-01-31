import { ObservableStore } from "@metamask/obs-store";
import { CUSTODIAN_TYPES } from "@metamask-institutional/custody-keyring";
import { ITransactionStatusMap } from "@metamask-institutional/types";
import { toChecksumHexAddress } from "./utils";
import { CustodyAccountDetails } from "./types";

/**
 * @typedef {Object} CustodyOptions
 * @property {Object} initState The initial controller state
 */

/**
 * Background controller responsible for maintaining
 * a cache of custody data in local storage
 */
export class CustodyController {
  public store;
  /**
   * Creates a new controller instance
   *
   * @param {CustodyOptions} [opts] - Controller configuration parameters
   */
  constructor(opts: any = {}) {
    const { initState } = opts;

    this.store = new ObservableStore({
      custodyAccountDetails: {} as { [key: string]: CustodyAccountDetails },
      custodianConnectRequest: {},
      ...initState,
    });
  }

  storeCustodyStatusMap(custody: string, custodyStatusMap: ITransactionStatusMap): void {
    const { custodyStatusMaps } = this.store.getState();

    this.store.updateState({
      custodyStatusMaps: {
        ...custodyStatusMaps,
        [custody.toLowerCase()]: custodyStatusMap,
      },
    });
  }

  storeSupportedChainsForAddress(address: string, supportedChains: string[], custodianName: string): void {
    const { custodianSupportedChains } = this.store.getState();

    this.store.updateState({
      custodianSupportedChains: {
        ...custodianSupportedChains,
        [address]: {
          supportedChains: supportedChains.map(chain => Number(chain).toString()),
          custodianName: custodianName,
        },
      },
    });
  }

  setAccountDetails(newAccountDetails: CustodyAccountDetails[]): void {
    const { custodyAccountDetails } = this.store.getState();
    const accountsToAdd = {};
    newAccountDetails.forEach(item => {
      if (!custodyAccountDetails[toChecksumHexAddress(item.address)]) {
        accountsToAdd[toChecksumHexAddress(item.address)] = item;
      }
    });
    this.store.updateState({
      custodyAccountDetails: {
        ...custodyAccountDetails,
        ...accountsToAdd,
      },
    });
  }

  removeAccount(address: string): void {
    const { custodyAccountDetails } = this.store.getState();
    delete custodyAccountDetails[toChecksumHexAddress(address)];
    this.store.updateState({ custodyAccountDetails });
  }

  setWaitForConfirmDeepLinkDialog(waitForConfirmDeepLinkDialog: boolean): void {
    this.store.updateState({
      waitForConfirmDeepLinkDialog,
    });
  }

  getAccountDetails(address: string): CustodyAccountDetails {
    const { custodyAccountDetails } = this.store.getState();
    return custodyAccountDetails[toChecksumHexAddress(address)];
  }

  getCustodyTypeByAddress(address: string): string {
    const { custodyAccountDetails } = this.store.getState();
    return custodyAccountDetails[address]?.custodyType;
  }

  getAllCustodyTypes(): Set<string | unknown> {
    const custodyTypes = new Set();
    const { custodyAccountDetails } = this.store.getState();

    for (const address of Object.keys(custodyAccountDetails)) {
      custodyTypes.add(custodyAccountDetails[address]?.custodyType);
    }
    return custodyTypes;
  }

  setCustodianConnectRequest({
    token,
    apiUrl,
    custodianName,
    custodianType,
  }: {
    token: string;
    apiUrl: string;
    custodianName: string;
    custodianType: string;
  }): void {
    this.store.updateState({
      custodianConnectRequest: { token, apiUrl, custodianName, custodianType },
    });
  }

  getCustodianConnectRequest(): {
    token: string;
    apiUrl: string;
    custodianName: string;
    custodianType: string;
  } {
    const { custodianConnectRequest } = this.store.getState();
    this.store.updateState({
      custodianConnectRequest: {},
    });
    return custodianConnectRequest;
  }
  handleMmiCustodianInUse(req: {
    origin: string;
    params: {
      custodianName: string;
    };
  }): boolean {
    if (!req.params.custodianName) {
      throw new Error("Missing parameter: custodianName");
    }

    const custodian = CUSTODIAN_TYPES[req.params.custodianName.toUpperCase()];

    let allowed = false;

    if (custodian) {
      for (const origin of custodian.origins) {
        if (origin.test(req.origin)) {
          allowed = true;
        }
      }
    }

    if (!allowed) {
      throw new Error("Forbidden");
    }

    const { custodyAccountDetails } = this.store.getState();

    for (const address of Object.keys(custodyAccountDetails)) {
      if (custodyAccountDetails[address]?.custodyType === `Custody - ${custodian.name}`) {
        return true;
      }
    }

    return false;
  }
}