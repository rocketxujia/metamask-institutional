import { ICustodianType } from "@metamask-institutional/types";
import { CurvCustodyKeyring } from "./curv/CurvCustodyKeyring";
import { JsonRpcCustodyKeyring } from "./json-rpc/JsonRpcCustodyKeyring";
import { JsonApiCustodyKeyring } from "./json-api/JsonApiCustodyKeyring";


export const CUSTODIAN_TYPES: { [key: string]: ICustodianType } = {

  // All new custodians are an instance of this type
  JSONRPC: {
    name: "JSONRPC",
    displayName: "JSON-RPC",
    apiUrl: "https://saturn-custody.codefi.network/eth",
    imgSrc: "https://saturn-custody-ui.metamask-institutional.io/saturn.svg",
    icon: "https://saturn-custody-ui.metamask-institutional.io/saturn.svg",
    website: "https://saturn-custody-ui.metamask-institutional.io/",
    onboardingUrl: "https://saturn-custody-ui.metamask-institutional.io/",
    envName: "saturn-prod",
    keyringClass: JsonRpcCustodyKeyring,
    production: false,
    hidden: true, // Since this is the prototype, we don't want to show it in the UI
    origins: [],
    environmentMapping: [], // No environment mapping for JSON-RPC custodians as this is derived from the configuration service
  },

  // All new custodians are an instance of this type
  JSONAPI: {
    name: "JSONAPI",
    displayName: "JSON-API",
    apiUrl: "",
    imgSrc: "",
    icon: "",
    website: "",
    onboardingUrl: "", // portal
    envName: "portal-prod",
    keyringClass: JsonApiCustodyKeyring,
    production: false,
    hidden: true, // Since this is the prototype, we don't want to show it in the UI
    origins: [/.*cobo\.com.*/, /.*localhost.*/],
    environmentMapping: [], // 
  },

  // Legacy Custodian
  CURV: {
    name: "Curv",
    displayName: "Curv",
    apiUrl: "https://app.curv.co",
    imgSrc: "images/curv-logo-horizontal-black.svg",
    icon: "images/curv-logo.svg",
    website: "",
    onboardingUrl: "",
    envName: "",
    keyringClass: CurvCustodyKeyring,
    production: false,
    hidden: true,
    origins: [],
    environmentMapping: [],
  },
};
