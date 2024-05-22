import { JsonPortalResult } from "../interfaces/JsonPortalResult";
import { JsonRpcCreateTransactionResult } from "../rpc-responses/JsonRpcCreateTransactionResult";

export const mockJsonRpcCreateTransactionResponse: JsonPortalResult<JsonRpcCreateTransactionResult> = {
  success: true,
  result: "ef8cb7af-1a00-4687-9f82-1f1c82fbef54",
};
