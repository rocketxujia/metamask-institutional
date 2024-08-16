# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.2.12](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.2.11...@mm-institutional/sdk@0.2.12) (2024-08-16)

### Bug Fixes

- [scw-hide_send-wallet_type] 保存 wallet type 字段 ([9939426](https://github.com/consensys-vertical-apps/metamask-institutional/commit/993942685c1e663b1189c6d6bc791fab9793ed4c))

## [0.2.11](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.2.10...@mm-institutional/sdk@0.2.11) (2024-08-15)

### Features

- [scw-new-api-add] 新增 Scw 钱包地址的 Api 接口逻辑 ([a3994a0](https://github.com/consensys-vertical-apps/metamask-institutional/commit/a3994a0ad0136afe71867665369cc61da7c61d2f))

## [0.2.10](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.2.9...@mm-institutional/sdk@0.2.10) (2024-08-12)

### Bug Fixes

- [scw-hide_send-wallet_type] 保存 wallet type 字段 ([a45c96c](https://github.com/consensys-vertical-apps/metamask-institutional/commit/a45c96c09719f3bf53e01ac87427744cebc1b02d))

## [0.2.9](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.2.8...@mm-institutional/sdk@0.2.9) (2024-08-09)

### Bug Fixes

- [import-filter-wallet] add filterParams for custodyKeyring -> sdk -> api ([6aa287b](https://github.com/consensys-vertical-apps/metamask-institutional/commit/6aa287b7f2ae1ee53c3bb4aeaa11e38718edcdde))

## [0.2.8](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.2.7...@mm-institutional/sdk@0.2.8) (2024-08-08)

**Note:** Version bump only for package @mm-institutional/sdk

## [0.2.7](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.2.6...@mm-institutional/sdk@0.2.7) (2024-08-08)

### Features

- [import-filter-wallet] import scw wallet by portal wallet id ([90e8bd8](https://github.com/consensys-vertical-apps/metamask-institutional/commit/90e8bd8c5c7449541ef463dccda6fa9032c95052))

## [0.2.6](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.2.4...@mm-institutional/sdk@0.2.6) (2024-07-29)

### Bug Fixes

- **jsop-api-tx-res:** custodianStatusReason null issue ([db41d37](https://github.com/consensys-vertical-apps/metamask-institutional/commit/db41d3727074ac77bce9685038c40629d9f9d773))
- **jsop-api-tx-res:** query error message ([199be83](https://github.com/consensys-vertical-apps/metamask-institutional/commit/199be83e796fab4ae672859a8b4a1ca04808dd05))

## [0.2.4](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.2.3...@mm-institutional/sdk@0.2.4) (2024-07-12)

### Bug Fixes

- **jsop-api-tx-res:** 添加 reason 到 Portal 交易 ([92da1a3](https://github.com/consensys-vertical-apps/metamask-institutional/commit/92da1a34ae44e1fcf9cdeccf893ae9ed74ad8dc5))

## [0.2.3](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.2.2...@mm-institutional/sdk@0.2.3) (2024-07-11)

### Bug Fixes

- **jsop-api-tx-res:** connect_request_id 命名 ([87df743](https://github.com/consensys-vertical-apps/metamask-institutional/commit/87df7438c4dc284c8cad10b80010b9fcd0d0f3ec))

## 0.2.2 (2024-07-11)

### Bug Fixes

- **check null values:** checking null values in signedMEssage and transaction ([#233](https://github.com/consensys-vertical-apps/metamask-institutional/issues/233)) ([3e21fb9](https://github.com/consensys-vertical-apps/metamask-institutional/commit/3e21fb95f764a9ffe6aea1e459737f7cf62408f7))
- **content-type:** setting content-type as json ([#494](https://github.com/consensys-vertical-apps/metamask-institutional/issues/494)) ([c1afa70](https://github.com/consensys-vertical-apps/metamask-institutional/commit/c1afa70c366576952b997ad025a46a77b5affdeb))
- **errormessage:** if the server responds with a 401 status code when trying to get the access token ([#534](https://github.com/consensys-vertical-apps/metamask-institutional/issues/534)) ([593b2a2](https://github.com/consensys-vertical-apps/metamask-institutional/commit/593b2a228364deaac657435a3fcf840bb6f9e84f))
- **fetchapi:** error handling with fetch api ([#500](https://github.com/consensys-vertical-apps/metamask-institutional/issues/500)) ([cf64009](https://github.com/consensys-vertical-apps/metamask-institutional/commit/cf6400906b1b34b1120370b0624448ade71cedb0))
- **github:** npm publish 后自动更新后代码 githead ([6ac833e](https://github.com/consensys-vertical-apps/metamask-institutional/commit/6ac833e27b26b732322b5345cc8d8f79aa5abbb3))
- **jsop-api-tx-res:** 添加 request_id, result 到 Portal 交易 ([5ad09b3](https://github.com/consensys-vertical-apps/metamask-institutional/commit/5ad09b368cb91d3c425b9d5dc115db2839c5d2f4))
- **lint:** lint issues were fixes ([#509](https://github.com/consensys-vertical-apps/metamask-institutional/issues/509)) ([ce5f9af](https://github.com/consensys-vertical-apps/metamask-institutional/commit/ce5f9afaa20d6afad6e81d0d97bc6894055fc00c))
- **npmignore:** clean up ([#271](https://github.com/consensys-vertical-apps/metamask-institutional/issues/271)) ([a4bbae1](https://github.com/consensys-vertical-apps/metamask-institutional/commit/a4bbae1887ef3cead82b58bd2ec14fbfcd40f662))
- only create an ITR event if the custodian returns a URL where the user can go ([#608](https://github.com/consensys-vertical-apps/metamask-institutional/issues/608)) ([dc17ed2](https://github.com/consensys-vertical-apps/metamask-institutional/commit/dc17ed2e60b8cf44d3b3d49e5ccac5c7e9e51959))
- **package:** update modified modules version and yarn ([714f7de](https://github.com/consensys-vertical-apps/metamask-institutional/commit/714f7de2b6fc67bb87b8e6f89b383631ffc75fb6))
- **refresh-token:** logic around refresh token ([#682](https://github.com/consensys-vertical-apps/metamask-institutional/issues/682)) ([14b771c](https://github.com/consensys-vertical-apps/metamask-institutional/commit/14b771c1f5d1a613ead9fd568cae8e0cba8b9464))
- **response:** response result ([#543](https://github.com/consensys-vertical-apps/metamask-institutional/issues/543)) ([d649bd3](https://github.com/consensys-vertical-apps/metamask-institutional/commit/d649bd32476507c3d68a4c777d51f2c4f7a5acb7))
- **sdk:** bump version ([#721](https://github.com/consensys-vertical-apps/metamask-institutional/issues/721)) ([a965fe4](https://github.com/consensys-vertical-apps/metamask-institutional/commit/a965fe4732d07bfeb72dfa9ba4ceb132b23261d2))
- **sdk:** fetch is not working as axios so we moved our logic outside catch ([#140](https://github.com/consensys-vertical-apps/metamask-institutional/issues/140)) ([b9391aa](https://github.com/consensys-vertical-apps/metamask-institutional/commit/b9391aa2ea24b9e80b2e555253b165ad60f468d4))
- **updates packages:** updates packages to the latest versions ([#278](https://github.com/consensys-vertical-apps/metamask-institutional/issues/278)) ([0dc78c5](https://github.com/consensys-vertical-apps/metamask-institutional/commit/0dc78c5321d8b686320a7d83bd45eae93fefb36a))

### Features

- **namespace:** change namespace ([e8b5fac](https://github.com/consensys-vertical-apps/metamask-institutional/commit/e8b5fac50b8b59e69906fdf828185064b1b0e4e8))

### Dependencies

- The following workspace dependencies were updated
  - dependencies
    - @mm-institutional/types bumped from ^1.0.4 to ^1.1.0

## [0.1.27](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.26...sdk-v0.1.27) (2024-05-15)

### Bug Fixes

- **sdk:** bump version ([#721](https://github.com/consensys-vertical-apps/metamask-institutional/issues/721)) ([a965fe4](https://github.com/consensys-vertical-apps/metamask-institutional/commit/a965fe4732d07bfeb72dfa9ba4ceb132b23261d2))

## [0.1.25](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.24...sdk-v0.1.25) (2024-04-03)

### Bug Fixes

- **refresh-token:** logic around refresh token ([#682](https://github.com/consensys-vertical-apps/metamask-institutional/issues/682)) ([14b771c](https://github.com/consensys-vertical-apps/metamask-institutional/commit/14b771c1f5d1a613ead9fd568cae8e0cba8b9464))

## [0.1.24](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.23...sdk-v0.1.24) (2024-01-23)

### Bug Fixes

- only create an ITR event if the custodian returns a URL where the user can go ([#608](https://github.com/consensys-vertical-apps/metamask-institutional/issues/608)) ([dc17ed2](https://github.com/consensys-vertical-apps/metamask-institutional/commit/dc17ed2e60b8cf44d3b3d49e5ccac5c7e9e51959))

## [0.1.23](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.22...sdk-v0.1.23) (2023-11-08)

### Bug Fixes

- **response:** response result ([#543](https://github.com/consensys-vertical-apps/metamask-institutional/issues/543)) ([d649bd3](https://github.com/consensys-vertical-apps/metamask-institutional/commit/d649bd32476507c3d68a4c777d51f2c4f7a5acb7))

## [0.1.22](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.21...sdk-v0.1.22) (2023-11-07)

### Bug Fixes

- **errormessage:** if the server responds with a 401 status code when trying to get the access token ([#534](https://github.com/consensys-vertical-apps/metamask-institutional/issues/534)) ([593b2a2](https://github.com/consensys-vertical-apps/metamask-institutional/commit/593b2a228364deaac657435a3fcf840bb6f9e84f))

### Dependencies

- The following workspace dependencies were updated
  - dependencies
    - @mm-institutional/types bumped from ^1.0.3 to ^1.0.4

## [0.1.21](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.20...sdk-v0.1.21) (2023-10-20)

### Bug Fixes

- **lint:** lint issues were fixes ([#509](https://github.com/consensys-vertical-apps/metamask-institutional/issues/509)) ([ce5f9af](https://github.com/consensys-vertical-apps/metamask-institutional/commit/ce5f9afaa20d6afad6e81d0d97bc6894055fc00c))

## [0.1.20](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.19...sdk-v0.1.20) (2023-10-12)

### Bug Fixes

- **fetchapi:** error handling with fetch api ([#500](https://github.com/consensys-vertical-apps/metamask-institutional/issues/500)) ([cf64009](https://github.com/consensys-vertical-apps/metamask-institutional/commit/cf6400906b1b34b1120370b0624448ade71cedb0))

## [0.1.19](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.18...sdk-v0.1.19) (2023-10-03)

### Bug Fixes

- **content-type:** setting content-type as json ([#494](https://github.com/consensys-vertical-apps/metamask-institutional/issues/494)) ([c1afa70](https://github.com/consensys-vertical-apps/metamask-institutional/commit/c1afa70c366576952b997ad025a46a77b5affdeb))

## [0.1.18](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.17...sdk-v0.1.18) (2023-05-25)

### Bug Fixes

- **check null values:** checking null values in signedMEssage and transaction ([#233](https://github.com/consensys-vertical-apps/metamask-institutional/issues/233)) ([3e21fb9](https://github.com/consensys-vertical-apps/metamask-institutional/commit/3e21fb95f764a9ffe6aea1e459737f7cf62408f7))
- **npmignore:** clean up ([#271](https://github.com/consensys-vertical-apps/metamask-institutional/issues/271)) ([a4bbae1](https://github.com/consensys-vertical-apps/metamask-institutional/commit/a4bbae1887ef3cead82b58bd2ec14fbfcd40f662))
- **sdk:** fetch is not working as axios so we moved our logic outside catch ([#140](https://github.com/consensys-vertical-apps/metamask-institutional/issues/140)) ([b9391aa](https://github.com/consensys-vertical-apps/metamask-institutional/commit/b9391aa2ea24b9e80b2e555253b165ad60f468d4))
- **updates packages:** updates packages to the latest versions ([#278](https://github.com/consensys-vertical-apps/metamask-institutional/issues/278)) ([0dc78c5](https://github.com/consensys-vertical-apps/metamask-institutional/commit/0dc78c5321d8b686320a7d83bd45eae93fefb36a))

### Dependencies

- The following workspace dependencies were updated
  - dependencies
    - @mm-institutional/simplecache bumped from ^1.0.2 to ^1.1.0
    - @mm-institutional/types bumped from ^1.0.2 to ^1.0.3

## [0.1.17](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.14...sdk-v0.1.17) (2023-05-17)

### Bug Fixes

- **updates packages:** updates packages to the latest versions ([#278](https://github.com/consensys-vertical-apps/metamask-institutional/issues/278)) ([0dc78c5](https://github.com/consensys-vertical-apps/metamask-institutional/commit/0dc78c5321d8b686320a7d83bd45eae93fefb36a))

## [0.1.14](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.13...sdk-v0.1.14) (2023-05-15)

### Bug Fixes

- **npmignore:** clean up ([#271](https://github.com/consensys-vertical-apps/metamask-institutional/issues/271)) ([a4bbae1](https://github.com/consensys-vertical-apps/metamask-institutional/commit/a4bbae1887ef3cead82b58bd2ec14fbfcd40f662))

## [0.1.13](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.12...sdk-v0.1.13) (2023-04-20)

### Bug Fixes

- **check null values:** checking null values in signedMEssage and transaction ([#233](https://github.com/consensys-vertical-apps/metamask-institutional/issues/233)) ([3e21fb9](https://github.com/consensys-vertical-apps/metamask-institutional/commit/3e21fb95f764a9ffe6aea1e459737f7cf62408f7))

## [0.1.14](https://github.com/consensys-vertical-apps/metamask-institutional/compare/sdk-v0.1.13...sdk-v0.1.14) (2023-02-15)

### Bug Fixes

- **sdk:** fetch is not working as axios so we moved our logic outside catch ([#140](https://github.com/consensys-vertical-apps/metamask-institutional/issues/140)) ([b9391aa](https://github.com/consensys-vertical-apps/metamask-institutional/commit/b9391aa2ea24b9e80b2e555253b165ad60f468d4))

## [0.1.13](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.12...@mm-institutional/sdk@0.1.13) (2023-02-02)

**Note:** Version bump only for package @mm-institutional/sdk

## [0.1.12](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.10...@mm-institutional/sdk@0.1.12) (2023-02-01)

**Note:** Version bump only for package @mm-institutional/sdk

### Dependencies

- The following workspace dependencies were updated
  - dependencies
    - @mm-institutional/simplecache bumped from ^0.1.4 to ^1.0.0
    - @mm-institutional/types bumped from ^0.1.28 to ^1.0.0

## [0.1.10](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.9...@mm-institutional/sdk@0.1.10) (2023-01-31)

**Note:** Version bump only for package @mm-institutional/sdk

## [0.1.9](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.8...@mm-institutional/sdk@0.1.9) (2023-01-27)

**Note:** Version bump only for package @mm-institutional/sdk

## [0.1.8](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.7...@mm-institutional/sdk@0.1.8) (2023-01-26)

**Note:** Version bump only for package @mm-institutional/sdk

## [0.1.7](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.6...@mm-institutional/sdk@0.1.7) (2023-01-25)

**Note:** Version bump only for package @mm-institutional/sdk

## [0.1.6](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.5...@mm-institutional/sdk@0.1.6) (2023-01-25)

**Note:** Version bump only for package @mm-institutional/sdk

## [0.1.5](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.4...@mm-institutional/sdk@0.1.5) (2023-01-24)

**Note:** Version bump only for package @mm-institutional/sdk

## [0.1.4](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.3...@mm-institutional/sdk@0.1.4) (2023-01-23)

**Note:** Version bump only for package @mm-institutional/sdk

## [0.1.3](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.2...@mm-institutional/sdk@0.1.3) (2023-01-20)

**Note:** Version bump only for package @mm-institutional/sdk

## [0.1.2](https://github.com/consensys-vertical-apps/metamask-institutional/compare/@mm-institutional/sdk@0.1.1...@mm-institutional/sdk@0.1.2) (2023-01-20)

**Note:** Version bump only for package @mm-institutional/sdk

## 0.1.1 (2023-01-20)

**Note:** Version bump only for package @mm-institutional/sdk

## 0.1.0 (2023-01-13)

**Note:** Initial bootstrap
