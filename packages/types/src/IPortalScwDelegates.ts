interface Label {
  key: string;
  value: string;
}
interface Delegate {
  name: string;
  address: string;
  Labels: Label[];
  gasBalance: number;
}

export type IPortalScwDelegates = Delegate[];
