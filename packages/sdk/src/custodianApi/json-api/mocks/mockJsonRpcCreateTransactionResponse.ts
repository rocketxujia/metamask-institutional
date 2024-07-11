import { JsonPortalResult } from "../interfaces/JsonPortalResult";
import { JsonApiCreateTransactionResult } from "../rpc-responses/JsonRpcCreateTransactionResult";

export const mockJsonRpcCreateTransactionResponse: JsonPortalResult<JsonApiCreateTransactionResult> = {
  success: true,
  result: {
    tx_id: "ef8cb7af-1a00-4687-9f82-1f1c82fbef54",
    request_id: "mock_request_id",
  },
};
