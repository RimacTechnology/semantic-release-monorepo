# @rimac-technology/semantic-release-monorepo

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Conventional Changelog](https://img.shields.io/badge/changelog-conventional-brightgreen.svg)](http://conventional-changelog.github.io)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-conventionalcommits-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
## Overview

This project is a TypeScript-enhanced version of the original
[semantic-release-monorepo](https://github.com/pmowrer/semantic-release-monorepo). It leverages TypeScript for improved type
safety and includes updates to dependencies, codebase simplification, and support for ECMAScript Modules (ESM).

## Installation

Ensure both `semantic-release` and `semantic-release-monorepo` are accessible in each package of your monorepo.

Install the package as a development dependency using yarn:

```shell
  yarn add --dev @rimac-technology/semantic-release-monorepo
```

or npm:

```shell
npm install --dev @rimac-technology/semantic-release-monorepo
```

## Configuration

It is designed to integrate seamlessly with your current semantic-release workflow. Simply replace instances where you call the
semantic-release CLI command with semantic-release-monorepo. For example, in your package.json's release script:

```json
{
    "scripts": {
        "release": "semantic-release-monorepo"
    }
}
```

Or, when using it in the CLI:

```shell
semantic-release-monorepo --extends @semantic-release/gitlab-config --dry-run
```

ℹ️ As the [allowUnknownFlags](https://github.com/sindresorhus/meow#allowunknownflags) is enabled, all flags will be passed to
internal `semantic-release` call as `options` argument.

## How it works

This library modifies the `context` object passed to `semantic-release` plugins in the following way to make them compatible with
a monorepo.

| Step             | Description                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `analyzeCommits` | Filters `context.commits` to only include the given monorepo package's commits.                                                                                                                                                                                                                                                                                                                                               |
| `generateNotes`  | <ul><li>Filters `context.commits` to only include the given monorepo package's commits.</li><li>Modifies `context.nextRelease.version` to use the [monorepo git tag format](#how). The wrapped (default) `generateNotes` implementation uses this variable as the header for the release notes. Since all release notes end up in the same Git repository, using just the version as a header introduces ambiguity.</li></ul> |

### tagFormat

To prevent version conflicts, git tags are created with a namespace that incorporates the name of the package, such as
`my-package-name@1.0.1`. To change this default setting, specify a
[tagFormat](https://semantic-release.gitbook.io/semantic-release/usage/configuration#tagformat) key in the `.releaserc`.

⚠️ **Remember**, it's essential to choose a format that ensures each workspace/release is unique.

## Custom Release Logic with processCommits

The `.releaserc` configuration allows an optional `processCommits` function, which allows you to define custom logic to determine if a release should be triggered based on a specific set of commits.

This function receives a single argument of type `CommitWithFilePaths`. The `CommitWithFilePaths` interface extends the regular commit data by adding a `filePaths` array that lists all file paths changed in the commit. Using this data, you can decide whether the changes affect your releasable packages and trigger a release accordingly.

#### Example Usage

For example, if you're using Yarn as your package manager, you can retrieve all workspaces in your monorepo with:

```bash
yarn workspaces list --json
```

Within the `processCommits` function,
you can match the changed file paths against the paths of these workspaces
to determine if any dependencies of your releasable package have been modified.
Based on this analysis, you can choose which commits should trigger a release

Here’s how you might define this in your `.releaserc`:

```javascript
export default {
    branches: ['main'],
    plugins: ['@semantic-release/commit-analyzer', '@semantic-release/release-notes-generator'],
    processCommits(commitsWithFilePaths) {
        const packageJson = readPackageSync() // if using read-pkg npm package
        const dependencies = [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.devDependencies)]
    
        const workspaces = execSync('yarn workspaces list --json').toString().trim().split(EOL)
            .filter((workspace) => Boolean(workspace))
            .map((workspace) => JSON.parse(workspace))

        const affectedCommits = []

        for (const workspace of workspaces) {
            if (!dependencies.includes(workspace.name)) {
                continue
            }

            affectedCommits.push(...commitsWithFilePaths.filter((commitWithFilePath) =>
                commitWithFilePath.filePaths.some((filePath) => filePath.startsWith(workspace.location)),
            ))
        }

        return affectedCommits
  },
}

```

