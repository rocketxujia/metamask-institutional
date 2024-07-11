export interface JsonRpcGetTransactionByIdResponse {
  id: string;
  request_id: string;
  tx_type: string;
  from_address: string;
  to_address: string;
  value: string;
  data: string;
  gas_price?: string;
  gas_limit: string;
  max_fee?: string;
  max_priority_fee?: string;
  nonce: string;
  hash: string;
  timeline: {
    finished: boolean;
    submitted: boolean;
    signed: boolean;
    success: boolean;
    displayText: string;
    reason: string;
  };
}
