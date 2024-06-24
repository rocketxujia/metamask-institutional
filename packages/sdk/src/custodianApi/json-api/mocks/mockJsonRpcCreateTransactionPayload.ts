import { JsonApiCreateTransactionPayload } from "../rpc-payloads/JsonRpcCreateTransactionPayload";

export const mockJsonApiCreateTransactionPayload: JsonApiCreateTransactionPayload = {
  from_address: "0xb2c77973279baaaf48c295145802695631d50c01", // Sending address
  to_address: "0x57f36031E223FabC1DaF93B401eD9F4F1Acc6904", // 0x-prefixed hex string address
  tx_type: "0x2",
  value: "0x1", // 0x-prefixed hex string (Value)
  data: null, // 0x-prefixed hex string (Data)
  fee: {
    gas_limit: "0x5208", // 0x-prefixed hex string (Gas Limit)
    max_priority_fee: "0x59682f0e", // 0x-prefixed hex string (Max Priority Fee Per Gas) , unit GWei
    max_fee: "0x59682f0e", // 0x-prefixed hex string (Max Fee Per Gas) , unit GWei
  },
  chain_id: "0x4",
  origin_url: "https://www.example.com",
};
