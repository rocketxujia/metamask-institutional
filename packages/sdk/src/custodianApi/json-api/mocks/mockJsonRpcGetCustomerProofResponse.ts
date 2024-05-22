import { JsonPortalResult } from "../interfaces/JsonPortalResult";
import { JsonRpcGetCustomerProofResponse } from "../rpc-responses/JsonRpcGetCustomerProofResponse";

export const mockJsonRpcGetCustomerProofResponse: JsonPortalResult<JsonRpcGetCustomerProofResponse> = {
  success: true,
  result: {
    jwt: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTYiLCJpc3MiOiJleGFtcGxlLmNvbSJ9.IlBfD4xmjpQiQCrkiIwIztEHrEH7e7RuswWPbIlJwUI",
  },
};
