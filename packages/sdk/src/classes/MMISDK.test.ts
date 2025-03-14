import { AuthTypes } from "@mm-institutional/types";
import { mocked } from "ts-jest/utils";

import { JsonPortalCustodianApi } from "../custodianApi/json-api/JsonPortalCustodianApi";
import { JsonRpcCustodianApi } from "../custodianApi/json-rpc/JsonRpcCustodianApi";
import { MessageTypes, TypedMessage } from "../interfaces/ITypedMessage";
import { MMISDK } from "./MMISDK";

jest.mock("../custodianApi/json-api/JsonPortalCustodianApi");

describe("MMISDK", () => {
  let mmiSDK: MMISDK;
  const mockedCustodianApi = mocked(JsonPortalCustodianApi, true);

  let mockedCustodianApiInstance;

  beforeAll(() => {
    mmiSDK = new MMISDK(
      // @TODO check back later
      // @ts-ignore
      JsonPortalCustodianApi,
      {
        jwt: "xyz",
      },
      AuthTypes.TOKEN,
      "http://",
    );
    mockedCustodianApiInstance = mockedCustodianApi.mock.instances[0];
    mockedCustodianApiInstance.on = jest.fn();
  });

  describe("MMISDK#getAccountHierarchy", () => {
    it("should call the custodian API", async () => {
      await mmiSDK.getAccountHierarchy();
      expect(mockedCustodianApiInstance.getAccountHierarchy).toHaveBeenCalled();
    });
  });

  describe("MMISDK#getEthereumAccounts", () => {
    it("should call the custodian API", async () => {
      mockedCustodianApiInstance.getEthereumAccounts = jest.fn().mockResolvedValueOnce([]);
      await mmiSDK.getEthereumAccounts();
      expect(mockedCustodianApiInstance.getEthereumAccounts).toHaveBeenCalledWith(null, {});
    });

    it("should call the custodian API width filter params", async () => {
      mockedCustodianApiInstance.getEthereumAccounts = jest.fn().mockResolvedValueOnce([]);
      await mmiSDK.getEthereumAccounts(null, { type: "mpc" });
      expect(mockedCustodianApiInstance.getEthereumAccounts).toHaveBeenCalledWith(null, { type: "mpc" });
    });
  });

  describe("MMISDK#getEthereumAccountsByLabelOrAddressName", () => {
    it("should call the custodian API", async () => {
      mockedCustodianApiInstance.getEthereumAccountsByLabelOrAddressName = jest.fn().mockResolvedValueOnce([]);
      await mmiSDK.getEthereumAccountsByLabelOrAddressName("test");
      expect(mockedCustodianApiInstance.getEthereumAccountsByLabelOrAddressName).toHaveBeenCalledWith("test", null, {});
    });
    it("should call the custodian API width filter params", async () => {
      mockedCustodianApiInstance.getEthereumAccountsByLabelOrAddressName = jest.fn().mockResolvedValueOnce([]);
      await mmiSDK.getEthereumAccountsByLabelOrAddressName("test", null, { type: "mpc" });
      expect(mockedCustodianApiInstance.getEthereumAccountsByLabelOrAddressName).toHaveBeenCalledWith("test", null, {
        type: "mpc",
      });
    });
  });

  describe("MMISDK#getEthereumAccountsByAddress", () => {
    it("should call the custodian API", async () => {
      mockedCustodianApiInstance.getEthereumAccountsByAddress = jest.fn().mockResolvedValueOnce([]);
      await mmiSDK.getEthereumAccountsByAddress("0x1");
      expect(mockedCustodianApiInstance.getEthereumAccountsByAddress).toHaveBeenCalledWith("0x1", null, {});
    });

    it("should call the custodian API idth filter params", async () => {
      mockedCustodianApiInstance.getEthereumAccountsByAddress = jest.fn().mockResolvedValueOnce([]);
      await mmiSDK.getEthereumAccountsByAddress("0x1", null, { type: "mpc" });
      expect(mockedCustodianApiInstance.getEthereumAccountsByAddress).toHaveBeenCalledWith("0x1", null, {
        type: "mpc",
      });
    });
  });

  describe("MMISDK#createTransaction", () => {
    it("should call the custodian API", async () => {
      mockedCustodianApiInstance.createTransaction = jest
        .fn()
        .mockResolvedValueOnce({ custodian_transactionId: "xxx" });

      const fromAddress = "0x";
      const txParams = {
        from: fromAddress,
        to: "to",
        value: "1",
        gasPrice: "1",
        gasLimit: "1", // No data
      };

      await mmiSDK.createTransaction(txParams, { chainId: "1" });

      expect(mockedCustodianApiInstance.createTransaction).toHaveBeenCalledWith(txParams, { chainId: "1" });
    });
  });

  describe("MMISDK#getCustomerId", () => {
    it("should call the custodian API", async () => {
      await mmiSDK.getCustomerId();

      expect(mockedCustodianApiInstance.getCustomerId).toHaveBeenCalled();
    });
  });

  describe("MMISDK#getTransaction", () => {
    it("should call the custodian API", async () => {
      await mmiSDK.getTransaction("xxx", "yyy");

      expect(mockedCustodianApiInstance.getTransaction).toHaveBeenCalledWith("xxx", "yyy");
    });
  });

  describe("MMISDK#getCustomerId", () => {
    it("should call the custodian API", async () => {
      await mmiSDK.getAllTransactions();

      expect(mockedCustodianApiInstance.getAllTransactions).toHaveBeenCalled();
    });
  });

  describe("MMISDK#signTypedData_v4", () => {
    it("should call signTypedData on the custodian API", async () => {
      mockedCustodianApiInstance.signTypedData_v4 = jest.fn().mockResolvedValueOnce({
        custodian_transactionId: "xxx",
        from: "",
        bufferType: "v4",
        isSignedMessage: true,
      });

      const buffer: TypedMessage<MessageTypes> = {
        types: {
          EIP712Domain: [],
        },
        primaryType: "test",
        domain: {
          name: "test",
        },
        message: {},
      };

      await mmiSDK.signedTypedData_v4("0x", buffer, "v4", { chainId: null, originUrl: null });

      expect(mockedCustodianApiInstance.signTypedData_v4).toHaveBeenCalledWith("0x", buffer, "v4", {
        chainId: null,
        originUrl: null,
      });
    });
  });

  describe("MMISDK#getErc20Tokens", () => {
    it("should call getErc20Tokens on the custodian API", async () => {
      await mmiSDK.getErc20Tokens();

      expect(mockedCustodianApiInstance.getErc20Tokens).toHaveBeenCalled();
    });
  });

  describe("MMISDK#constructor(Jupiter)", () => {
    it("should also construct an SDK for Jupiter", () => {
      const mmiSDK2 = new MMISDK(
        // @TODO check back later
        // @ts-ignore
        JsonRpcCustodianApi,
        {
          jwt: "xyz",
        },
        AuthTypes.TOKEN,
        "http://",
      );

      expect(mmiSDK2).toBeDefined();
    });
  });

  describe("MMISDK#getSupportedChains", () => {
    it("should call the custodian API", async () => {
      await mmiSDK.getSupportedChains("0x");

      expect(mockedCustodianApiInstance.getSupportedChains).toHaveBeenCalled();
    });
  });

  describe("MMISDK#signPersonalMessage", () => {
    it("should call signPersonalMessage on the custodian API", async () => {
      mockedCustodianApiInstance.signPersonalMessage = jest.fn().mockResolvedValueOnce({
        custodian_transactionId: "xxx",
        from: "",
        bufferType: "personal",
        isSignedMessage: true,
      });

      await mmiSDK.signPersonalMessage("0x", "0x", { chainId: null, originUrl: null });

      expect(mockedCustodianApiInstance.signPersonalMessage).toHaveBeenCalledWith("0x", "0x", {
        chainId: null,
        originUrl: null,
      });
    });
  });

  describe("MMISDK#getTransactionLink", () => {
    it("should call the custodian API", async () => {
      await mmiSDK.getTransactionLink("xxx");

      expect(mockedCustodianApiInstance.getTransactionLink).toHaveBeenCalledWith("xxx");
    });
  });
});
