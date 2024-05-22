import { JsonPortalResult } from "../interfaces/JsonPortalResult";
import { JsonRpcGetTransactionByIdResponse } from "../rpc-responses/JsonRpcGetTransactionByIdResponse";

export const mockJsonRpcGetTransactionByIdResponse: JsonPortalResult<JsonRpcGetTransactionByIdResponse> = {
  success: true,
  result: {
    id: "ef8cb7af-1a00-4687-9f82-1f1c82fbef54",
    tx_type: "0x2",
    from_address: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
    to_address: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    value: "0x0",
    gas_price: "0x5208",
    gas_limit: "0x4A817C800",
    nonce: "0x1",
    data: "0x",
    hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    timeline: {
      finished: true,
      submitted: true,
      signed: true,
      success: true,
      displayText: "Mined",
      reason: null,
    },
  },
};
