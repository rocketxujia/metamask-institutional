import { MMISDK, mmiSDKFactory } from "@mm-institutional/sdk";
import { IExtensionCustodianAccount, IRefreshTokenAuthDetails } from "@mm-institutional/types";
import crypto, { Hash } from "crypto";
import { mocked } from "ts-jest/utils";

import { JsonRpcCustodyKeyring } from "./JsonRpcCustodyKeyring";
import { JsonRpcStatusMap } from "./JsonRpcStatusMap";

jest.mock("@mm-institutional/sdk");

const mockedMmiSdkFactory = mocked(mmiSDKFactory, true);

const mockMMISDK = {
  getAccountHierarchy: jest.fn(),
  getEthereumAccounts: jest.fn().mockResolvedValue([
    {
      name: "myCoolAccount",
      address: "0x123456",
      custodianDetails: {},
      labels: [{ key: "my-label", value: "my-label" }],
      jwt: "jwt",
      apiUrl: "apiUrl",
      envName: "saturn",
    },
  ]),
  getSignature: jest.fn(),
  getEthereumAccountsByAddress: jest.fn().mockResolvedValue([]),
  getEthereumAccountsByLabelOrAddressName: jest.fn().mockResolvedValue([]),
  createTransaction: jest.fn(),
  getTransaction: jest.fn(),
  getAllTransactions: jest.fn(),
  getCustomerId: jest.fn(),
  signedTypedData_v4: jest.fn(),
  getErc20Tokens: jest.fn(),
  subscribeToEvents: jest.fn(),
  registerEventCallback: jest.fn(),
  handlePing: jest.fn(),
  checkPing: jest.fn(),
  handleEvent: jest.fn(),
  getTransactionLink: jest.fn().mockResolvedValue({}),
  changeRefreshTokenAuthDetails: jest.fn(),
  getCustomerProof: jest.fn(),
  eventCallbacks: [],
  jwt: "",
  defaultCacheAgeSeconds: 0,
  lastPing: 0,
  pingCheckRunning: false,
  cache: null,
  custodianApi: null,
  on: jest.fn(),
};

const mockMmiConfigurationController = {
  store: {
    getState: jest.fn().mockReturnValue({
      mmiConfiguration: {
        custodians: [
          {
            apiUrl: "https://api",
            envName: "saturn",
          },
        ],
      },
    }),
  },
  configurationClient: {},
  storeConfiguration: jest.fn(),
  getConfiguration: jest.fn(),
  getWebsocketApiUrl: jest.fn(),
};

describe("JsonRpcCustodyKeyring", () => {
  let custodyKeyring: JsonRpcCustodyKeyring;

  beforeEach(() => {
    custodyKeyring = new JsonRpcCustodyKeyring({
      mmiConfigurationController: mockMmiConfigurationController,
    });
    jest.clearAllMocks();
    mockedMmiSdkFactory.mockReturnValue(mockMMISDK as unknown as MMISDK);
  });

  describe("getTransactionDeepLink", () => {
    it("should call the getTransactionDeepLink method on the sdk", async () => {
      const mockSelectedAddresses: IExtensionCustodianAccount[] = [
        {
          name: "myCoolAccount1",
          address: "0x123456",
          custodianDetails: { wallet_id: "test" },
          labels: [{ key: "my-label", value: "my-label" }],
          token: "jwt",
          apiUrl: "https://api",
          chainId: 4,
          custodyType: "Saturn",
          envName: "saturn",
        },
      ];

      custodyKeyring.setSelectedAddresses(mockSelectedAddresses);
      custodyKeyring.addAccounts(1);

      const result = await custodyKeyring.getTransactionDeepLink("0x123456", "12345");

      expect(mockMMISDK.getTransactionLink).toHaveBeenCalledWith("12345");

      expect(result).toEqual({});
    });

    it("should return null if the call fails", async () => {
      const mockSelectedAddresses: IExtensionCustodianAccount[] = [
        {
          name: "myCoolAccount1",
          address: "0x123456",
          custodianDetails: { wallet_id: "test" },
          labels: [{ key: "my-label", value: "my-label" }],
          token: "jwt",
          apiUrl: "https://api",
          chainId: 4,
          custodyType: "Saturn",
          envName: "saturn",
        },
      ];

      custodyKeyring.setSelectedAddresses(mockSelectedAddresses);
      custodyKeyring.addAccounts(1);

      mockMMISDK.getTransactionLink = jest.fn().mockRejectedValueOnce("error");

      const result = await custodyKeyring.getTransactionDeepLink("0x123456", "12345");

      expect(result).toEqual(null);
    });
  });

  describe("getStatusMap", () => {
    it("should return the status map", () => {
      expect(custodyKeyring.getStatusMap()).toEqual(JsonRpcStatusMap);
    });
  });

  // This method is tested in the JSON-RPC Keyring test, but that has a different AuthType
  describe("hashAuthDetails", () => {
    it("should hash the refreshtoken together with the custodian API URL", () => {
      const authDetails: IRefreshTokenAuthDetails = {
        refreshToken: "miaow",
      };

      const url = "https://api";
      const envName = "saturn";
      const address = "0x123";

      const hashMock = {
        update: jest.fn().mockReturnThis(),
        digest: jest.fn().mockReturnValueOnce("fake hash"),
      } as unknown as Hash;

      // Mocking the crypto module
      const createHashMock = jest.spyOn(crypto, "createHash").mockImplementationOnce(() => hashMock);

      const result = custodyKeyring.hashAuthDetails(authDetails, envName, address);

      expect(createHashMock).toBeCalledWith("sha256");
      expect(hashMock.update).toBeCalledWith(`${envName}_${address}`);
      expect(hashMock.digest).toBeCalledWith("hex");

      expect(result).toEqual("fake hash");
    });
  });

  describe("createAuthDetails", () => {
    it("should take a token and turn it into IRefreshTokenAuthDetails", () => {
      const jwt = "token";

      const result = custodyKeyring.createAuthDetails(jwt);

      expect(result).toEqual({
        refreshToken: jwt,
      });
    });
  });

  describe("getCustomerProof", () => {
    it("should get the sdk and call the getCustomerProof method", async () => {
      const mockSelectedAddresses: IExtensionCustodianAccount[] = [
        {
          name: "myCoolAccount1",
          address: "0x123456",
          custodianDetails: { wallet_id: "test" },
          labels: [{ key: "my-label", value: "my-label" }],
          token: "jwt",
          apiUrl: "https://api",
          chainId: 4,
          custodyType: "Saturn",
          envName: "saturn",
        },
      ];

      custodyKeyring.setSelectedAddresses(mockSelectedAddresses);
      custodyKeyring.addAccounts(1);

      await custodyKeyring.getCustomerProof("0x123456");

      expect(mockMMISDK.getCustomerProof).toHaveBeenCalled();
    });
  });

  describe("replaceRefreshTokenAuthDetails", () => {
    it("given an address and new auth Details, it calls the sdk with the new auth details", async () => {
      const mockSelectedAddresses: IExtensionCustodianAccount[] = [
        {
          name: "myCoolAccount1",
          address: "0x123456",
          custodianDetails: { wallet_id: "test" },
          labels: [{ key: "my-label", value: "my-label" }],
          token: "jwt",
          apiUrl: "https://api",
          chainId: 4,
          custodyType: "Saturn",
          envName: "saturn",
        },
      ];

      custodyKeyring.setSelectedAddresses(mockSelectedAddresses);
      custodyKeyring.addAccounts(1);

      const refreshToken = "newToken";

      await custodyKeyring.replaceRefreshTokenAuthDetails("0x123456", refreshToken);

      expect(mockMMISDK.changeRefreshTokenAuthDetails).toHaveBeenCalledWith({
        refreshToken,
      });
    });
  });

  describe("updateAuthDetails", () => {
    it("updates the auth details with imported addresses", () => {
      const mockSelectedAddresses: IExtensionCustodianAccount[] = [
        {
          name: "myCoolAccount1",
          address: "0x123456",
          custodianDetails: { wallet_id: "test" },
          labels: [{ key: "my-label", value: "my-label" }],
          token: "jwt",
          apiUrl: "https://api",
          chainId: 4,
          custodyType: "Saturn",
          envName: "saturn",
        },
      ];

      custodyKeyring.setSelectedAddresses(mockSelectedAddresses);
      custodyKeyring.addAccounts(1);

      custodyKeyring.updateAccountsDetailsWithNewRefreshToken("jwt", "newToken", "saturn");

      expect((custodyKeyring.accountsDetails[0].authDetails as IRefreshTokenAuthDetails).refreshToken).toEqual(
        "newToken",
      );
    });
  });

  describe("getSignature", () => {
    it("should call the sdk with the correct params", async () => {
      const mockSelectedAddresses: IExtensionCustodianAccount[] = [
        {
          name: "myCoolAccount1",
          address: "0x123456",
          custodianDetails: { wallet_id: "test" },
          labels: [{ key: "my-label", value: "my-label" }],
          token: "jwt",
          apiUrl: "https://api",
          chainId: 4,
          custodyType: "Saturn",
          envName: "saturn",
        },
      ];

      custodyKeyring.setSelectedAddresses(mockSelectedAddresses);
      custodyKeyring.addAccounts(1);

      await custodyKeyring.getSignature("0x123456", "signed-message-id");

      expect(mockMMISDK.getSignature).toHaveBeenCalledWith("0x123456", "signed-message-id");
    });
  });
});
