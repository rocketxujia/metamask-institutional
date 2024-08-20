export interface JsonScwDelegatesPayload {
  /**
   * Transaction data
   */
  data: string;
  /**
   * The address to which the transaction is sent
   */
  to_address: string;
  /**
   * The value of the transaction
   */
  value: string;

  /**
   * The wallet address
   */
  wallet_address: string;
  from_address?: string;

  chain_id: string;
}

export interface JsonScwBuildTransactionPayload extends JsonScwDelegatesPayload {
  delegate_address: string;
}
