import { JsonPortalResult } from "../interfaces/JsonPortalResult";
import { JsonRpcListAccountChainIdsResponse } from "../rpc-responses/JsonRpcListAccountChainIdsResponse";

export const mockJsonRpcListAccountChainIdsResponse: JsonPortalResult<JsonRpcListAccountChainIdsResponse> = {
  success: true,
  result: ["0x1", "0x3"],
};
