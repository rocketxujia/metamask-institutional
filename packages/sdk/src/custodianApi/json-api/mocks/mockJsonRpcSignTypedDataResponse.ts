import { JsonPortalResult } from "../interfaces/JsonPortalResult";
import { JsonApiSignTypedDataResponse } from "../rpc-responses/JsonRpcSignTypedDataResponse";

export const mockJsonRpcSignTypedDataResponse: JsonPortalResult<JsonApiSignTypedDataResponse> = {
  success: true,
  result: {
    msg_id: "ef8cb7af-1a00-4687-9f82-1f1c82fbef54",
  },
};
