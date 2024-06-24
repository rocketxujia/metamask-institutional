export interface JsonRpcGetSignedMessageByIdResponse {
  address: string;
  signature: string;
  timeline: {
    finished: boolean;
    submitted: boolean;
    signed: boolean;
    success: boolean;
    displayText: string;
    reason: string;
  };
}
