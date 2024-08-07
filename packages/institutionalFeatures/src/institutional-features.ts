import { ObservableStore } from "@metamask/obs-store";
import { CUSTODIAN_TYPES } from "@mm-institutional/custody-keyring";
import { ConnectionRequest, ConnectRequest } from "@mm-institutional/types";

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
    feature: string,
    service: string,
    chainId?: string,
    environment?: string,
    name?: string,
  ): void {
    if (!CUSTODIAN_TYPES[service.toUpperCase()]) {
      throw new Error("No such custodian");
    }
    const state = this.store.getState();
    this.store.updateState({
      institutionalFeatures: {
        ...state.institutionalFeatures,
        connectRequests: [
          // ...state.institutionalFeatures.connectRequests,
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
      feature: string;
      service: string;
      chainId?: string;
      environment?: string;
      name?: string;
    };
  }): boolean {
    if (!req.params.feature) {
      throw new Error("Missing parameter: feature");
    }
    if (!req.params.service) {
      throw new Error("Missing parameter: service");
    }
    if (!req.params.token) {
      throw new Error("Missing parameter: token");
    }

    // Ignore features for now
    switch (req.params.feature) {
      case "custodian":
        this.authenticateToCustodian(
          req.origin,
          req.method,
          req.params.token,
          req.params.labels,
          req.params.feature,
          req.params.service,
          req.params.chainId,
          req.params.environment,
          req.params.name,
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
