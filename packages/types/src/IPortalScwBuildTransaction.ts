export interface IPortalScwBuildTransaction {
  /**
   * The data of the transaction
   */
  data?: string;
  /**
   * The address from which the transaction was sent
   */
  fromAddress?: string;
  /**
   * The address to which the transaction was sent
   */
  toAddress?: string;
  /**
   * The value of the transaction
   */
  value?: number;
}
