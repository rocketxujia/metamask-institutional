interface AccountWithMetadata {
  address: string;
  name: string;
  tags: [{ name: string; value: string }];
  walletType: string;
}

export type JsonRpcListAccountsResponse = AccountWithMetadata[];
