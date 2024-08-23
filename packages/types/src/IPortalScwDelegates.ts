interface Label {
  key: string;
  value: string;
}
export interface Delegate {
  name: string;
  address: string;
  labels: Label[];
  gasBalance: string;
}

export type IPortalScwDelegates = Delegate[];
