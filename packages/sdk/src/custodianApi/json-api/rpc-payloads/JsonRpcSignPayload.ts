export type JsonRpcSignPayload = {
  signing_address: string;
  payload: string;
  message_type: "EIP191";
};
