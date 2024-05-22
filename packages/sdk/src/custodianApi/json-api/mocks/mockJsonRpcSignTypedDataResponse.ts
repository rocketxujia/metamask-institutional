import { JsonPortalResult } from "../interfaces/JsonPortalResult";
import { JsonRpcSignTypedDataResponse } from "../rpc-responses/JsonRpcSignTypedDataResponse";

export const mockJsonRpcSignTypedDataResponse: JsonPortalResult<JsonRpcSignTypedDataResponse> = {
  success: true,
  result: "ef8cb7af-1a00-4687-9f82-1f1c82fbef54",
};
