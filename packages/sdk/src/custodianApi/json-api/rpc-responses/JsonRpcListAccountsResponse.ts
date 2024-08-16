interface AccountWithMetadata {
  address: string;
  name: string;
  tags: [{ name: string; value: string }];
  wallet_type: string;
}

export type JsonRpcListAccountsResponse = AccountWithMetadata[];
