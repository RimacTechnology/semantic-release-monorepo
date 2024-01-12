# @rimac-technology/semantic-release-monorepo

This project is a TypeScript-based fork of the original
[semantic-release-monorepo](https://github.com/pmowrer/semantic-release-monorepo). It enhances the original project by
incorporating TypeScript for stronger type safety, updated dependencies, a simplified codebase, and support for ECMAScript Modules
(ESM).

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Changelog](https://img.shields.io/badge/changelog-conventional-brightgreen.svg)](http://conventional-changelog.github.io)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Install

Both `semantic-release` and `semantic-release-monorepo` must be accessible in each monorepo package.

```bash
yarn add --dev @rimac-technology/semantic-release-monorepo
```

In the
[release config](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration-file):

```sh
semantic-release-monorepo [options]
```

For example:

```sh
semantic-release-monorepo --extends @semantic-release/gitlab-config --dry-run
```

ℹ️ As the [`allowUnknownFlags`](https://github.com/sindresorhus/meow#allowunknownflags) is enabled, all flags will be passed to
internal `semantic-release` call as `options` argument.

## Advanced

This library modifies the `context` object passed to `semantic-release` plugins in the following way to make them compatible with
a monorepo.

| Step             | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `analyzeCommits` | Filters `context.commits` to only include the given monorepo package's commits.                                                                                                                                                                                                                                                                                                                                               |
| `generateNotes`  | <ul><li>Filters `context.commits` to only include the given monorepo package's commits.</li><li>Modifies `context.nextRelease.version` to use the [monorepo git tag format](#how). The wrapped (default) `generateNotes` implementation uses this variable as the header for the release notes. Since all release notes end up in the same Git repository, using just the version as a header introduces ambiguity.</li></ul> |

### tagFormat

To prevent version conflicts, git tags are created with a namespace that incorporates the name of the package, such as
`my-package-name@1.0.1`. To change this default setting, specify a
[tagFormat](https://github.com/semantic-release/semantic-release/blob/caribou/docs/usage/configuration.md#tagformat) key in the
`.releaserc`.

**Remember**, it's essential to choose a format that ensures each workspace/release is unique.
