import { SimpleCache } from "@mm-institutional/simplecache";
import { IRefreshTokenChangeEvent } from "@mm-institutional/types";
import crypto from "crypto";
import { EventEmitter } from "events";

import { INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, REFRESH_TOKEN_CHANGE_EVENT } from "../../constants/constants";
import { JsonPortalError } from "./interfaces/JsonPortalError";
import { JsonPortalResult } from "./interfaces/JsonPortalResult";
import { JsonApiCreateTransactionPayload } from "./rpc-payloads/JsonRpcCreateTransactionPayload";
import { JsonRpcGetSignedMessageByIdPayload } from "./rpc-payloads/JsonRpcGetSignedMessageByIdPayload";
import { JsonRpcGetTransactionByIdPayload } from "./rpc-payloads/JsonRpcGetTransactionByIdPayload";
import { JsonRpcListAccountChainIdsPayload } from "./rpc-payloads/JsonRpcListAccountChainIdsPayload";
import { JsonRpcSignPayload } from "./rpc-payloads/JsonRpcSignPayload";
import { JsonRpcSignTypedDataPayload } from "./rpc-payloads/JsonRpcSignTypedDataPayload";
import { JsonApiCreateTransactionResult } from "./rpc-responses/JsonRpcCreateTransactionResult";
import { JsonRpcGetCustomerProofResponse } from "./rpc-responses/JsonRpcGetCustomerProofResponse";
import { JsonRpcGetSignedMessageByIdResponse } from "./rpc-responses/JsonRpcGetSignedMessageByIdResponse";
import { JsonRpcGetTransactionByIdResponse } from "./rpc-responses/JsonRpcGetTransactionByIdResponse";
import { JsonRpcListAccountsResponse } from "./rpc-responses/JsonRpcListAccountsResponse";
import { JsonApiSignResponse } from "./rpc-responses/JsonRpcSignResponse";
import { JsonApiSignTypedDataResponse } from "./rpc-responses/JsonRpcSignTypedDataResponse";

export class JsonPortalClient extends EventEmitter {
  private cache: SimpleCache;

  // At the start, we don't know how long the token will be valid for
  private cacheAge = null;

  private requestId = 0;

  constructor(
    private apiBaseUrl: string = "http://127.0.0.1:4523/m1/3409424-1099445-default",
    private refreshToken: string,
    private refreshTokenUrl: string,
  ) {
    super();
    this.cache = new SimpleCache();
  }

  // This could be from a "top down" refresh token change
  // which doesn't emit an event

  setRefreshToken(refreshToken: string) {
    const payload: IRefreshTokenChangeEvent = {
      oldRefreshToken: this.refreshToken,
      newRefreshToken: refreshToken,
    };
    this.emit(REFRESH_TOKEN_CHANGE_EVENT, payload);
    this.refreshToken = refreshToken;
  }

  async getAccessToken(): Promise<string> {
    if (this.cacheAge) {
      const cacheExists = this.cache.cacheExists("accessToken");

      if (cacheExists && this.cache.cacheValid("accessToken", this.cacheAge)) {
        return this.cache.getCache<string>("accessToken");
      }
    }

    try {
      const url = this.refreshTokenUrl;
      const data = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: this.refreshToken,
      });

      const options = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };

      const response = await fetch(url, {
        method: "POST",
        body: data,
        headers: options.headers,
        credentials: "same-origin", // this is the default value for "withCredentials" in the Fetch API
      });

      const responseJson = await response.json();

      /**
       * If the server responds with a 401 status code when trying to get the access token,
       * it means the refresh token provided is no longer valid.
       * This could be due to the token being expired, revoked, or the token not being recognized by the server.
       *
       */
      if (response?.status === 401) {
        const url = responseJson?.url;
        const oldRefreshToken = this.refreshToken;
        const hashedToken = crypto
          .createHash("sha256")
          .update(oldRefreshToken + url)
          .digest("hex");

        this.emit(INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, {
          url,
          oldRefreshToken: hashedToken,
        });

        throw new Error("Refresh token provided is no longer valid.");
      }

      if (!response.ok || responseJson.error_code) {
        throw new Error(`Request failed with status ${response.status}: ${responseJson.error_message}`);
      }

      const resultJson = responseJson.result;
      this.cacheAge = resultJson.expires_in;
      this.cache.setCache<string>("accessToken", resultJson.access_token);

      if (resultJson.refresh_token && resultJson.refresh_token !== this.refreshToken) {
        console.log(
          "JsonRPCClient: Refresh token changed to " +
            resultJson.refresh_token.substring(0, 5) +
            "..." +
            resultJson.refresh_token.substring(resultJson.refresh_token.length - 5),
        );

        const oldRefreshToken = this.refreshToken;
        // Set and emit REFRESH_TOKEN_CHANGE_EVENT event
        this.setRefreshToken(resultJson.refresh_token);
      }

      return resultJson.access_token;
    } catch (error) {
      throw new Error(`Error getting the Access Token: ${error}`);
    }
  }

  async listAccounts(): Promise<JsonPortalResult<JsonRpcListAccountsResponse>> {
    const accessToken = await this.getAccessToken();

    return this._fetch("/connect/accounts", {}, accessToken, "Get");
  }

  async getCustomerProof(): Promise<JsonPortalResult<JsonRpcGetCustomerProofResponse>> {
    const accessToken = await this.getAccessToken();

    return this._fetch("/connect/getCustomerProof", {}, accessToken, "Get");
  }

  async getAccountChainIds(
    listAccountChainIdPayload: JsonRpcListAccountChainIdsPayload,
  ): Promise<JsonPortalResult<string[]>> {
    const accessToken = await this.getAccessToken();

    return this._fetch("/connect/accounts/chains", listAccountChainIdPayload, accessToken, "Get");
  }

  async createTransaction(
    createTransactionPayload: JsonApiCreateTransactionPayload,
  ): Promise<JsonPortalResult<JsonApiCreateTransactionResult>> {
    const accessToken = await this.getAccessToken();

    return this._fetch("/connect/transactions", createTransactionPayload, accessToken);
  }

  async signPersonalMessage(signPayload: JsonRpcSignPayload): Promise<JsonPortalResult<JsonApiSignResponse>> {
    const accessToken = await this.getAccessToken();

    return this._fetch("/connect/sign_messages", signPayload, accessToken);
  }

  async signTypedData(
    signPayload: JsonRpcSignTypedDataPayload,
  ): Promise<JsonPortalResult<JsonApiSignTypedDataResponse>> {
    const accessToken = await this.getAccessToken();

    return this._fetch("/connect/sign_messages", signPayload, accessToken);
  }

  async getTransaction(
    id: JsonRpcGetTransactionByIdPayload,
  ): Promise<JsonPortalResult<JsonRpcGetTransactionByIdResponse>> {
    const accessToken = await this.getAccessToken();

    return this._fetch(`/connect/transactions/${id}`, {}, accessToken, "Get");
  }

  async getSignedMessage(
    messageId: JsonRpcGetSignedMessageByIdPayload,
  ): Promise<JsonPortalResult<JsonRpcGetSignedMessageByIdResponse>> {
    const accessToken = await this.getAccessToken();

    return this._fetch(`/connect/sign_messages/${messageId}`, {}, accessToken, "Get");
  }

  async _fetch<T1, T2>(path: string, data: T1, accessToken: string, method = "Post"): Promise<T2> {
    let response: Response;
    let responseJson: any;
    let url = this.apiBaseUrl + path;
    const options: any = {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      this.requestId++;
      if (method.toLowerCase() === "post") {
        options.body = JSON.stringify({
          ...data,
          request_id: this.requestId,
        });
      } else {
        // 构建查询字符串
        const queryString = new URLSearchParams({ ...data, request_id: `${this.requestId}` }).toString();
        url = `${url}?${queryString}`;
      }
      response = await fetch(url, options);
      responseJson = await response.json();

      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else if ((responseJson as JsonPortalError).error_code) {
        console.log("JsonPortalClient < ", this.requestId, url, responseJson);
        throw new Error(
          `[${(responseJson as JsonPortalError).error_code}]${(responseJson as JsonPortalError).error_description}`,
        );
      }
      console.debug("JsonPortalClient < ", this.requestId, url, (responseJson as JsonPortalResult<any>).result);
    } catch (e) {
      console.log("JsonPortalClient < ", this.requestId, url, e);
      throw e;
    }

    return responseJson;
  }
}
