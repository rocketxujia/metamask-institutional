import { ObservableStore } from "@metamask/obs-store";
import { CUSTODIAN_TYPES } from "@mm-institutional/custody-keyring";
import { ConnectionRequest, ConnectRequest, PortalWalletType } from "@mm-institutional/types";

interface PortalWalletInfo {
  type: PortalWalletType;
  id?: string;
}

/**
 * @typedef {Object} InstitutionalFeaturesOptions
 * @property {Object} initState The initial controller state
 */

/**
 * Background controller responsible for maintaining
 * a cache of institutional features data in local storage
 */
export class InstitutionalFeaturesController {
  public showConfirmRequest;
  public store;
  /**
   * Creates a new controller instance
   *
   * @param {InstitutionalFeaturesOptions} [opts] - Controller configuration parameters
   */
  constructor(opts: any = {}) {
    this.showConfirmRequest = opts.showConfirmRequest;
    const initState = opts.initState?.institutionalFeatures
      ? opts.initState
      : {
          institutionalFeatures: {
            connectRequests: [],
            channelId: null,
            connectionRequest: null,
          },
        };

    this.store = new ObservableStore({
      institutionalFeatures: {
        ...initState.institutionalFeatures,
        connectRequests: [...(initState.institutionalFeatures.connectRequests || [])],
        channelId: null,
        connectionRequest: null,
      },
    });
  }

  authenticateToCustodian(
    origin: string,
    method: string,
    token: string,
    labels: { key: string; value: any }[],
    service: string,
    environment: string,
    feature?: string,
    chainId?: string,
    name?: string,
    portalWalletInfo?: PortalWalletInfo,
  ): void {
    if (!CUSTODIAN_TYPES[service.toUpperCase()]) {
      throw new Error("No such custodian");
    }
    const state = this.store.getState();
    portalWalletInfo = portalWalletInfo || { type: PortalWalletType.MPC };
    this.store.updateState({
      institutionalFeatures: {
        ...state.institutionalFeatures,
        connectRequests: [
          {
            origin,
            method,
            token,
            labels,
            feature,
            service,
            chainId,
            environment,
            name,
            portalWalletInfo,
          },
        ],
      },
    });
    this.showConfirmRequest();
  }

  handleMmiAuthenticate(req: {
    origin: string;
    method: string;
    params: {
      token: string;
      labels: { key: string; value: any }[];
      feature?: string;
      service: string;
      chainId?: string;
      environment: string;
      name?: string;
      portalWalletInfo?: PortalWalletInfo;
    };
  }): boolean {
    if (!req.params.environment) {
      throw new Error("Missing parameter: environment");
    }
    if (!req.params.service) {
      throw new Error("Missing parameter: service");
    }
    if (!req.params.token) {
      throw new Error("Missing parameter: token");
    }
    req.params.feature = req.params.feature || "custodian";

    // Ignore features for now
    switch (req.params.feature) {
      case "custodian":
        this.authenticateToCustodian(
          req.origin,
          req.method,
          req.params.token,
          req.params.labels,
          req.params.service,
          req.params.environment,
          req.params.feature,
          req.params.chainId,
          req.params.name,
          req.params.portalWalletInfo,
        );
        break;
      default:
        throw new Error(`Service ${req.params.service} not supported`);
    }

    return true;
  }

  removeAddTokenConnectRequest({
    origin,
    environment,
    token,
  }: {
    origin: string;
    environment: string;
    token: string;
  }): void {
    const state = this.store.getState();
    this.store.updateState({
      institutionalFeatures: {
        ...state.institutionalFeatures,
        connectRequests: state.institutionalFeatures.connectRequests.filter(
          request => !(request.origin === origin && request.token === token && request.environment === environment),
        ),
      },
    });
  }

  setChannelId(channelId: string): void {
    const state = this.store.getState();
    this.store.updateState({
      institutionalFeatures: {
        ...state.institutionalFeatures,
        channelId,
      },
    });
  }

  setConnectionRequest(payload: ConnectionRequest): void {
    const state = this.store.getState();
    this.store.updateState({
      institutionalFeatures: {
        ...state.institutionalFeatures,
        connectionRequest: payload,
      },
    });
  }

  setConnectRequests(payload: ConnectRequest): void {
    const state = this.store.getState();
    this.store.updateState({
      institutionalFeatures: {
        ...state.institutionalFeatures,
        connectRequests: [payload, ...state.institutionalFeatures.connectRequests],
      },
    });
  }
}
