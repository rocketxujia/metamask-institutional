interface Tag {
  name: string;
  value: string;
}
export interface JsonScwDelegate {
  name: string;
  address: string;
  tags: Tag[];
  gas_balance: string;
}

interface JsonScwDelegates {
  delegates: JsonScwDelegate[];
}

export type JsonScwDelegatesResponse = JsonScwDelegates;

export interface JsonScwBuildTransactionResponse {
  /**
   * The data of the transaction
   */
  data?: string;
  /**
   * The address from which the transaction was sent
   */
  from_address?: string;
  /**
   * The address to which the transaction was sent
   */
  to_address?: string;
  /**
   * The value of the transaction
   */
  value?: number;
}
