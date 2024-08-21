export type JsonApiCreateTransactionPayload = JsonApiTransactionParams;

export interface JsonApiTransactionParams {
  from_address: string; // Sending address
  to_address: string; // 0x-prefixed hex string address
  tx_type: string; // Can be '0x1', '0x2', or '0x3' etc
  value: string; // 0x-prefixed hex string (Value)
  data: string; // 0x-prefixed hex string (Data)
  fee: Fee;
  chain_id: string;
  category?: string;
  origin_url?: string;
  note?: string;
  delegate_address?: string;
}

export interface Fee {
  gas_limit: string; // 0x-prefixed hex string (Gas Limit)
  gas_price?: string; // 0x-prefixed hex string (Gas Price)
  max_priority_fee?: string; // 0x-prefixed hex string (Max Priority Fee Per Gas) , unit GWei
  max_fee?: string; // 0x-prefixed hex string (Max Fee Per Gas) , unit GWei
}
