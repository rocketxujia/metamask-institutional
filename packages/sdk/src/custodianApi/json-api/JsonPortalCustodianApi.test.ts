import { AuthTypes, IEIP1559TxParams, ILegacyTXParams } from "@mm-institutional/types";
import { mocked } from "ts-jest/utils";

import { JsonPortalClient } from "./JsonPortalClient";
import { JsonPortalCustodianApi } from "./JsonPortalCustodianApi";
import { mockJsonRpcCreateTransactionResponse } from "./mocks/mockJsonRpcCreateTransactionResponse";
// import { mockJsonRpcGetCustomerProofResponse } from "./mocks/mockJsonRpcGetCustomerProofResponse";
// import { mockJsonRpcGetTransactionByIdPayload } from "./mocks/mockJsonRpcGetTransactionByIdPayload";
// import { mockJsonRpcGetTransactionByIdResponse } from "./mocks/mockJsonRpcGetTransactionByIdResponse";
// import { mockJsonRpcGetTransactionLinkPayload } from "./mocks/mockJsonRpcGetTransactionLinkPayload";
// import { mockJsonRpcGetTransactionLinkResponse } from "./mocks/mockJsonRpcGetTransactionLinkResponse";
import { mockJsonRpcListAccountChainIdsResponse } from "./mocks/mockJsonRpcListAccountChainIdsResponse";
import { mockJsonRpcListAccountResponse } from "./mocks/mockJsonRpcListAccountResponse";
// import { mockJsonRpcSignPayload } from "./mocks/mockJsonRpcSignPayload";
// import { mockJsonRpcSignResponse } from "./mocks/mockJsonRpcSignResponse";
// import { mockJsonRpcSignTypedDataPayload } from "./mocks/mockJsonRpcSignTypedDataPayload";
// import { mockJsonRpcSignTypedDataResponse } from "./mocks/mockJsonRpcSignTypedDataResponse";
// import { hexlify } from "../json-rpc/util/hexlify";
// import { mapStatusObjectToStatusText } from "./util/mapStatusObjectToStatusText";

jest.mock("./JsonPortalClient");

jest.mock("../../util/get-token-issuer", () => ({
  getTokenIssuer: jest.fn().mockReturnValue("some_website"),
}));

describe("JsonPortalCustodianApi", () => {
  let jsonPortalCustodianApi: JsonPortalCustodianApi;
  const mockedJsonPortalClient = mocked(JsonPortalClient, true);
  let mockedJsonPortalClientInstance;

  const mockJwt = "mock-jwt";
  const mockUrl = "http://mock-url";

  const fromAddress = mockJsonRpcListAccountResponse.result[0].address;

  beforeEach(() => {
    jsonPortalCustodianApi = new JsonPortalCustodianApi({ refreshToken: mockJwt }, AuthTypes.TOKEN, mockUrl, 0);

    mockedJsonPortalClientInstance = mockedJsonPortalClient.mock.instances[0];
    mockedJsonPortalClientInstance.listAccounts = jest.fn().mockImplementation(() => mockJsonRpcListAccountResponse);

    // mockedJsonPortalClientInstance.createTransaction = jest
    //   .fn()
    //   .mockImplementation(() => mockJsonRpcCreateTransactionResponse);

    // mockedJsonPortalClientInstance.getTransaction = jest
    //   .fn()
    //   .mockImplementation(() => mockJsonRpcGetTransactionByIdResponse);

    // mockedJsonPortalClientInstance.getTransactionLink = jest
    //   .fn()
    //   .mockImplementation(() => mockJsonRpcGetTransactionLinkResponse);

    // mockedJsonPortalClientInstance.getCustomerProof = jest
    //   .fn()
    //   .mockImplementation(() => mockJsonRpcGetCustomerProofResponse);

    // mockedJsonPortalClientInstance.signTypedData = jest.fn().mockImplementation(() => mockJsonRpcSignTypedDataResponse);

    // mockedJsonPortalClientInstance.signPersonalMessage = jest.fn().mockImplementation(() => mockJsonRpcSignResponse);

    // mockedJsonPortalClientInstance.getAccountChainIds = jest
    //   .fn()
    //   .mockImplementation(() => mockJsonRpcListAccountChainIdsResponse);

    mockedJsonPortalClientInstance.on = jest.fn().mockImplementation(() => mockJsonRpcListAccountChainIdsResponse);

    mockedJsonPortalClient.mockClear();
  });

  describe("getAccountHierarchy", () => {
    it("does nothing", async () => {
      const result = await jsonPortalCustodianApi.getAccountHierarchy();

      expect(result).toEqual(null);
    });
  });

  describe("getEthereumAccounts", () => {
    it("returns the accounts", async () => {
      const result = await jsonPortalCustodianApi.getEthereumAccounts();
      expect(mockedJsonPortalClientInstance.listAccounts).toHaveBeenCalled();

      expect(result).toEqual(
        mockJsonRpcListAccountResponse.result.map(account => ({
          name: account.name,
          address: account.address,
          custodianDetails: null,
          labels: account.tags.map(tag => ({
            key: tag.name,
            value: tag.value,
          })),
        })),
      );
    });
  });



});
