import { SimpleCache } from "@metamask-institutional/simplecache";
import fetchMock from "jest-fetch-mock";
import { mocked } from "ts-jest/utils";

import { INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT } from "../../constants/constants";
import { JsonPortalClient } from "./JsonPortalClient";
import { mockJsonRpcCreateTransactionPayload } from "../json-rpc/mocks/mockJsonRpcCreateTransactionPayload";
import { mockJsonRpcGetSignedMessageByIdPayload } from "../json-rpc/mocks/mockJsonRpcGetSignedMessageByIdPayload";
import { mockJsonRpcGetTransactionByIdPayload } from "../json-rpc/mocks/mockJsonRpcGetTransactionByIdPayload";
import { mockJsonRpcGetTransactionLinkPayload } from "../json-rpc/mocks/mockJsonRpcGetTransactionLinkPayload";
import { mockJsonRpcSignPayload } from "../json-rpc/mocks/mockJsonRpcSignPayload";
import { mockJsonRpcSignTypedDataPayload } from "../json-rpc/mocks/mockJsonRpcSignTypedDataPayload";

jest.mock("@metamask-institutional/simplecache");
fetchMock.enableMocks();

describe("JsonPortalClient", () => {
  let client: JsonPortalClient;

  const mockedSimpleCache = mocked(SimpleCache);
  let mockedSimpleCacheInstance;
  const hashedToken = "d704d4eab860b9793d8b1c03c0a0d4657908d48a5bd4b7fe0da82430b9e23e23";

  beforeEach(() => {
    jest.resetAllMocks();
    mockedSimpleCache.mockClear();
    fetchMock.resetMocks();

    client = new JsonPortalClient("http://test/json-rpc", "refresh_token", "http://refresh-token-url");

    mockedSimpleCacheInstance = mockedSimpleCache.mock.instances[0];

    fetchMock.mockResponse(
      JSON.stringify({
        result: {
          access_token: "accesstoken",
          expires_in: 10,
          refresh_token: "refresh_token",
        }
      }),
    );
  });

  describe("getAccessToken", () => {
    it("should call the refresh token URL and return the access token", async () => {
      const result = await client.getAccessToken();

      const expectedParams = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: "refresh_token",
      });
      expect(fetchMock).toHaveBeenCalledWith("http://refresh-token-url", {
        body: expectedParams,
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      expect(result).toEqual("accesstoken");
    });

    it("should not return the cached version if there is a cached version but it is invalid", async () => {
      // Run once to set the expires_in
      await client.getAccessToken();
  
      mockedSimpleCacheInstance.cacheExists = jest.fn().mockReturnValue(true);
      mockedSimpleCacheInstance.cacheValid = jest.fn().mockReturnValue(false);
      mockedSimpleCacheInstance.getCache = jest.fn().mockReturnValue("cached");
  
      const result = await client.getAccessToken();
  
      expect(result).toEqual("accesstoken");
    });
  
    it("should return the cached version if there is a cached version", async () => {
      // Run once to set the expires_in
      await client.getAccessToken();
  
      mockedSimpleCacheInstance.cacheExists = jest.fn().mockReturnValue(true);
      mockedSimpleCacheInstance.cacheValid = jest.fn().mockReturnValue(true);
      mockedSimpleCacheInstance.getCache = jest.fn().mockReturnValue("cached");
  
      const result = await client.getAccessToken();
  
      expect(result).toEqual("cached");
    });

    it("throws an error if there is a HTTP error", () => {
      fetchMock.mockRejectedValue(new Error("HTTP error"));

      expect(client.getAccessToken()).rejects.toThrow(`Error getting the Access Token: Error: HTTP error`);
    });

    it("emit an ITR event if there is a HTTP 401 error status", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          error: {
            message: "Test error",
          },
          url: "test"
        }),
        {
          status: 401,
          statusText: "Not Auth",
        }
      );

      const messageHandler = jest.fn();

      client.on(INTERACTIVE_REPLACEMENT_TOKEN_CHANGE_EVENT, messageHandler);

      try {
        await client.getAccessToken();
      } catch (e) {
        await new Promise((resolve, _reject) => {
          setTimeout(() => {
            expect(messageHandler).toHaveBeenCalledWith({
              oldRefreshToken: hashedToken,
              url: "test",
            });
            resolve(null);
          }, 100);
        });
        expect(e.toString()).toBe('Error: Error getting the Access Token: Error: Refresh token provided is no longer valid.');
      }
    });
  });

  describe("listAccounts", () => {
    beforeEach(() => {
      client._fetch = jest.fn();  
    }); 
    it("should call the custodian_listAccounts method on the json rpc caller", async () => {
      await client.listAccounts();
      expect(client._fetch).toHaveBeenCalledWith("/cobo_connect/custodian_listAccounts", {}, "accesstoken");
    });
  });

  describe("getCustomerProof", () => {
    beforeEach(() => {
      client._fetch = jest.fn();  
    }); 
    it("should call the custodian_listAccounts method on the json rpc caller", async () => {
      await client.getCustomerProof();
      expect(client._fetch).toHaveBeenCalledWith("/cobo_connect/custodian_getCustomerProof", {}, "accesstoken");
    });
  });

  describe("createTransaction", () => {
    beforeEach(() => {
      client._fetch = jest.fn();  
    }); 
    it("should call the custodian_createTransaction method on the json rpc caller", async () => {
      await client.createTransaction(mockJsonRpcCreateTransactionPayload);

      expect(client._fetch).toHaveBeenCalledWith(
        "/cobo_connect/custodian_createTransaction",
        mockJsonRpcCreateTransactionPayload,
        "accesstoken",
      );
    });
  });

  describe("listAccountChainIds", () => {
    beforeEach(() => {
      client._fetch = jest.fn();  
    }); 
    it("should call the custodian_listAccountChainIds method on the json rpc caller", async () => {
      await client.getAccountChainIds(["0xtest"]);
      expect(client._fetch).toHaveBeenCalledWith("/cobo_connect/custodian_listAccountChainIds", ["0xtest"], "accesstoken");
    });
  });

  describe("signPersonalMessage", () => {
    beforeEach(() => {
      client._fetch = jest.fn();  
    }); 
    it("should call the custodian_sign method on the json rpc caller", async () => {
      await client.signPersonalMessage(mockJsonRpcSignPayload);
      expect(client._fetch).toHaveBeenCalledWith("/cobo_connect/custodian_sign", mockJsonRpcSignPayload, "accesstoken");
    });
  });

  describe("signTypedData", () => {
    beforeEach(() => {
      client._fetch = jest.fn();  
    }); 
    it("should call the custodian_signTypedData method on the json rpc caller", async () => {
      await client.signTypedData(mockJsonRpcSignTypedDataPayload);
      expect(client._fetch).toHaveBeenCalledWith(
        "/cobo_connect/custodian_signTypedData",
        mockJsonRpcSignTypedDataPayload,
        "accesstoken",
      );
    });
  });

  describe("getSignedMessageBy", () => {
    beforeEach(() => {
      client._fetch = jest.fn();  
    }); 
    it("should call the custodian_getSignedMessageById method on the json rpc caller", async () => {
      await client.getSignedMessage(mockJsonRpcGetSignedMessageByIdPayload);
      expect(client._fetch).toHaveBeenCalledWith(
        "/cobo_connect/custodian_getSignedMessageById",
        mockJsonRpcGetSignedMessageByIdPayload,
        "accesstoken",
      );
    });
  });

  describe("getTransaction", () => {
    beforeEach(() => {
      client._fetch = jest.fn();  
    }); 
    it("should call the custodian_getTransactionById method on the json rpc caller", async () => {
      await client.getTransaction(mockJsonRpcGetTransactionByIdPayload);
      expect(client._fetch).toHaveBeenCalledWith(
        "/cobo_connect/custodian_getTransactionById",
        mockJsonRpcGetTransactionByIdPayload,
        "accesstoken",
      );
    });
  });

  describe("getTransactionLink", () => {
    beforeEach(() => {
      client._fetch = jest.fn();  
    }); 
    it("should call the custodian_getTransactionLink method on the json rpc caller", async () => {
      await client.getTransactionLink(mockJsonRpcGetTransactionLinkPayload);
      expect(client._fetch).toHaveBeenCalledWith(
        "/cobo_connect/custodian_getTransactionLink",
        mockJsonRpcGetTransactionLinkPayload,
        "accesstoken",
      );
    });
  });

});