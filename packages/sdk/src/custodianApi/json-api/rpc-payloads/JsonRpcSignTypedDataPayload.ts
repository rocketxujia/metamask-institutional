export type JsonRpcSignTypedDataPayload = {
  signing_address: string;
  payload: string;
  message_type: "EIP712";
  encoding_version: "v3";
  original_url?: string;
};
