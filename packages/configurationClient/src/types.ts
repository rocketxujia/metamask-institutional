interface IEnvironment {
  refreshTokenUrl: string;
  name: string;
  displayName: string;
  enabled: boolean;
  websocketApiUrl: string;
  apiBaseUrl: string;
  apiVersion: string;
  iconUrl: string;
  isNoteToTraderSupported: boolean;
  custodianPublishesTransaction: boolean;
}
export interface IJsonRpcCustodian {
  id?: string;
  clientId?: string;
  name: string;
  displayName?: string;
  iconUrl: string;
  website?: string;
  enabled?: boolean;
  apiBaseUrl?: string;
  issuerClaim?: string;
  jwksUrl?: string;
  refreshTokenUrl?: string;
  websocketApiUrl?: string;
  onboardingUrl?: string;
  enabledInOnboarding?: boolean;
  environments: IEnvironment[];
}

export interface IConfiguration {
  portfolio: {
    enabled: boolean;
    url: string;
    cookieSetUrls: string[];
  };
  features: {
    websocketApi: boolean;
  };
  custodians: IJsonRpcCustodian[];
}
