## [1.1.1](https://github.com/RimacTechnology/semantic-release-monorepo/compare/v1.1.0...v1.1.1) (2023-12-11)


### Bug Fixes

* inject correct workspace version on publish step ([fd6a1f2](https://github.com/RimacTechnology/semantic-release-monorepo/commit/fd6a1f2b2ce2ca4cd67ebe31bfcb5f4f3a6b62b3))
* pass full `monoContext` so that the `getSemanticConfig` doesnt error our ([f382929](https://github.com/RimacTechnology/semantic-release-monorepo/commit/f38292924c5fc6c13bdbb3d87f5bb079e0a32ea9))
* remove all flags to prevent setting default like `dry-run to true/false ([bfa2a85](https://github.com/RimacTechnology/semantic-release-monorepo/commit/bfa2a851454442d78c4e0eb551e38926b6c88f32))

## [1.1.0](https://github.com/RimacTechnology/semantic-release-monorepo/compare/v1.0.2...v1.1.0) (2023-12-11)


### ⚠ BREAKING CHANGES

* usage only via CLI

### Features

* implementation of cli wrapper around semantic release ([09fccda](https://github.com/RimacTechnology/semantic-release-monorepo/commit/09fccda14a616d051abb8a67cd843ec0a0384e47))


### Bug Fixes

* require `signale` package as its not ESM compatible library ([81400b3](https://github.com/RimacTechnology/semantic-release-monorepo/commit/81400b3397f6b18beda589f922dba67dae6a431c))


### Other

* **release:** 1.1.0-alpha.1 [skip ci] ([4f2cb27](https://github.com/RimacTechnology/semantic-release-monorepo/commit/4f2cb275ae1324173c5478f60266dbe644a3c063))
* **release:** 1.1.0-alpha.2 [skip ci] ([2908ea1](https://github.com/RimacTechnology/semantic-release-monorepo/commit/2908ea1f8444d496503c56cfc808e2918cf6bf27))

## [1.1.0-alpha.2](https://github.com/RimacTechnology/semantic-release-monorepo/compare/v1.1.0-alpha.1...v1.1.0-alpha.2) (2023-12-11)


### Bug Fixes

* require `signale` package as its not ESM compatible library ([81400b3](https://github.com/RimacTechnology/semantic-release-monorepo/commit/81400b3397f6b18beda589f922dba67dae6a431c))

## [1.1.0-alpha.1](https://github.com/RimacTechnology/semantic-release-monorepo/compare/v1.0.2...v1.1.0-alpha.1) (2023-12-11)


### ⚠ BREAKING CHANGES

* usage only via CLI

### Features

* implementation of cli wrapper around semantic release ([09fccda](https://github.com/RimacTechnology/semantic-release-monorepo/commit/09fccda14a616d051abb8a67cd843ec0a0384e47))

## [1.0.2](https://github.com/RimacTechnology/semantic-release-monorepo/compare/v1.0.1...v1.0.2) (2023-12-10)


### Bug Fixes

* set correct argument order when checking path relations ([ff9b007](https://github.com/RimacTechnology/semantic-release-monorepo/commit/ff9b007a46166e2977c07e4ea3a9fef47807a1d7))

## [1.0.1](https://github.com/RimacTechnology/semantic-release-monorepo/compare/v1.0.0...v1.0.1) (2023-12-10)


### Code Refactoring

* cache output of git cmds and checks for file relations ([5dd030c](https://github.com/RimacTechnology/semantic-release-monorepo/commit/5dd030ceb24939b0a6f096be7e51514117ee2dc6))

## 1.0.0 (2023-12-09)


### Features

* initial re-implementation of monorepo release ([c9572e6](https://github.com/RimacTechnology/semantic-release-monorepo/commit/c9572e66664b5562daa3fbcada8d5170a0f8a998))


### Bug Fixes

* set correct package path and update git file cmd ([2dac7cb](https://github.com/RimacTechnology/semantic-release-monorepo/commit/2dac7cb6dec718e581328eeaa7103ba6f397e3be))


### Other

* add missing yarn files ([e901e98](https://github.com/RimacTechnology/semantic-release-monorepo/commit/e901e986f84e7a5c33792f6792fdfe4e69f62161))
* re-generate yarn lock file ([60e1894](https://github.com/RimacTechnology/semantic-release-monorepo/commit/60e18941904b3a7f935d089933459d005d79ae8c))
* **release:** 1.0.0-alpha.1 [skip ci] ([5a44a33](https://github.com/RimacTechnology/semantic-release-monorepo/commit/5a44a3330a6a17bdf36f09752bf330efd73ebed6))
* **release:** 1.0.0-alpha.2 [skip ci] ([b6c4e1c](https://github.com/RimacTechnology/semantic-release-monorepo/commit/b6c4e1c1fb84fd716543bb50819282cbb39c37e6))
* **release:** 1.0.0-alpha.3 [skip ci] ([b784926](https://github.com/RimacTechnology/semantic-release-monorepo/commit/b784926a27fcf4a172e4b98687120f860a32a0a7))
* remove unnecessary logs ([a4f09e1](https://github.com/RimacTechnology/semantic-release-monorepo/commit/a4f09e1ee765959753e17a1200028f1b0794ead1))

## [1.0.0-alpha.3](https://github.com/RimacTechnology/semantic-release-monorepo/compare/v1.0.0-alpha.2...v1.0.0-alpha.3) (2023-12-09)


### Other

* remove unnecessary logs ([a4f09e1](https://github.com/RimacTechnology/semantic-release-monorepo/commit/a4f09e1ee765959753e17a1200028f1b0794ead1))

## [1.0.0-alpha.2](https://github.com/RimacTechnology/semantic-release-monorepo/compare/v1.0.0-alpha.1...v1.0.0-alpha.2) (2023-12-08)


### Bug Fixes

* set correct package path and update git file cmd ([2dac7cb](https://github.com/RimacTechnology/semantic-release-monorepo/commit/2dac7cb6dec718e581328eeaa7103ba6f397e3be))

## 1.0.0-alpha.1 (2023-12-08)


### Features

* initial re-implementation of monorepo release ([c9572e6](https://github.com/RimacTechnology/semantic-release-monorepo/commit/c9572e66664b5562daa3fbcada8d5170a0f8a998))


### Other

* add missing yarn files ([e901e98](https://github.com/RimacTechnology/semantic-release-monorepo/commit/e901e986f84e7a5c33792f6792fdfe4e69f62161))
* re-generate yarn lock file ([60e1894](https://github.com/RimacTechnology/semantic-release-monorepo/commit/60e18941904b3a7f935d089933459d005d79ae8c))
