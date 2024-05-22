import { IConfiguration } from "./types";
import defaultConfig from "./configuration";

export class ConfigurationClient {
  constructor(public configurationApiUrl: string = "") {}

  async getConfiguration(): Promise<IConfiguration> {
    console.log(`Fetching MMI configuration from ${this.configurationApiUrl}`);
    try {
      if (!Boolean(this.configurationApiUrl)) {
        return defaultConfig;
      }
      const response = await fetch(this.configurationApiUrl, { method: "GET" });
      const configData = await response.json();
      return configData as IConfiguration;
    } catch (e) {
      console.error(`Error fetching MMI configuration`);
      return defaultConfig;
    }
  }
}
