import { JsonPortalResult } from "../interfaces/JsonPortalResult";
import { JsonApiSignResponse } from "../rpc-responses/JsonRpcSignResponse";

export const mockJsonRpcSignResponse: JsonPortalResult<JsonApiSignResponse> = {
  success: true,
  result: {
    msg_id: "ef8cb7af-1a00-4687-9f82-1f1c82fbef54",
  },
};
