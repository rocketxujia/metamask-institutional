import fetchMock from "jest-fetch-mock";

import { ConfigurationClient } from "./ConfigurationClient";
import { MMI_CONFIGURATION_API_URL } from "./constants";
import defaultConfig from "./configuration";

fetchMock.enableMocks();

describe("ConfigurationClient", () => {
  let configurationClient: ConfigurationClient;

  beforeAll(() => {
    configurationClient = new ConfigurationClient(MMI_CONFIGURATION_API_URL);
  });

  beforeEach(() => {
    jest.resetAllMocks();
    fetchMock.resetMocks();
  });

  describe("ConfigurationClient#getConfiguration", () => {
    it("should GET the configuration endpoint and return the response body", async () => {
      fetchMock.mockResponseOnce(JSON.stringify("test"));

      const result = await configurationClient.getConfiguration();
      expect(fetchMock).toHaveBeenCalledWith(MMI_CONFIGURATION_API_URL, {
        method: "GET",
      });

      expect(result).toEqual("test");
    });

    it("should return default config if an exception is thrown by the HTTP client", async () => {
      fetchMock.mockImplementationOnce(() => {
        throw {
          response: {
            status: 400,
            data: "Fail",
          },
        };
      });

      const result = await configurationClient.getConfiguration();

      expect(result).toEqual(defaultConfig);
    });
  });

  describe("ConfigurationClient#constructor", () => {
    it("should use the dev configuration API by default", () => {
      const client = new ConfigurationClient(MMI_CONFIGURATION_API_URL);
      expect(client.configurationApiUrl).toEqual(MMI_CONFIGURATION_API_URL);
    });

    it("should use a specifed configuration API URL if present", () => {
      const client = new ConfigurationClient("http://test.com");
      expect(client.configurationApiUrl).toEqual("http://test.com");
    });
  });
});
