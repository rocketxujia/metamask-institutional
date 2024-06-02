const config = {
  "Readme": "This is important configuration file for Cobo Connect Browser Extension. Please do not modify it Unless you get the developer's permission",
  "Author": "jia.xu@cobo.com",
  "portfolio": {
    "enabled": false,
    "url": "",
    "cookieSetUrls": []
  },
  "features": {
    "websocketApi": false
  },
  "custodians": [
    {
      "name": "Cobo",
      "displayName": "Cobo",
      "iconUrl": "https://metamask-institutional.io/custodian-icons/cobo-icon.svg",
      "website": "https://www.cobo.com/custody",
      "onboardingUrl": "https://www.cobo.com/custody",
      "enabledInOnboarding": true,
      "environments": [
        {
          "refreshTokenUrl": "https://api.custody.cobo.com/v1/custody/mmi/token",
          "name": "cobo-prod",
          "displayName": "Cobo",
          "enabled": true,
          "websocketApiUrl": "wss://websocket.metamask-institutional.io/v1/ws",
          "apiBaseUrl": "https://api.custody.cobo.com/mmi",
          "apiVersion": "1",
          "custodianPublishesTransaction": true,
          "iconUrl": "https://consensys.gitlab.io/codefi/products/mmi/mmi-docs/assets/images/cobo-logo.svg",
          "isNoteToTraderSupported": false
        },
        {
          "refreshTokenUrl": "https://api.sandbox.cobo.com/v1/custody/mmi/token",
          "name": "cobo-sandbox",
          "displayName": "Cobo",
          "enabled": true,
          "websocketApiUrl": "wss://websocket.metamask-institutional.io/v1/ws",
          "apiBaseUrl": "https://api.sandbox.cobo.com/mmi",
          "apiVersion": "1",
          "custodianPublishesTransaction": true,
          "iconUrl": "https://consensys.gitlab.io/codefi/products/mmi/mmi-docs/assets/images/cobo-logo.svg",
          "isNoteToTraderSupported": false
        },
        {
          "refreshTokenUrl": "https://custody.develop.cobo.com/v1/custody/mmi/token",
          "name": "cobo-dev",
          "displayName": "Cobo",
          "enabled": true,
          "websocketApiUrl": "wss://websocket.metamask-institutional.io/v1/ws",
          "apiBaseUrl": "https://custody.develop.cobo.com/mmi",
          "apiVersion": "1",
          "custodianPublishesTransaction": true,
          "iconUrl": "https://consensys.gitlab.io/codefi/products/mmi/mmi-docs/assets/images/cobo-logo.svg",
          "isNoteToTraderSupported": false
        },
        {
          "name": "portal-sandbox",
          "displayName": "Cobo",
          "enabled": true,
          "refreshTokenUrl": "http://localhost:4523/m1/3409424-1099445-default/oauth/token/implicit_refresh_token",
          "websocketApiUrl": "",
          "apiVersion": "",
          "apiBaseUrl": "http://localhost:4523/m1/3409424-1099445-default",
          "custodianPublishesTransaction": true,
          "iconUrl": "https://consensys.gitlab.io/codefi/products/mmi/mmi-docs/assets/images/cobo-logo.svg",
          "isNoteToTraderSupported": false
        }
      ]
    }
  ]
};



export default config;