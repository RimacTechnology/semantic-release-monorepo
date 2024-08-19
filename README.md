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
| `analyzeCommits` | Filters context.commits to only include the given monorepo package's commits. Additionally, it checks whether any workspace that has been modified in the commits is listed as a dependency, devDependency, or peerDependency of the current workspace, and includes those commits as well.                                                                                                                                                                                                                                                                                                                                               |
| `generateNotes`  | <ul><li>Filters `context.commits` to only include the given monorepo package's commits.</li><li>Modifies `context.nextRelease.version` to use the [monorepo git tag format](#how). The wrapped (default) `generateNotes` implementation uses this variable as the header for the release notes. Since all release notes end up in the same Git repository, using just the version as a header introduces ambiguity.</li></ul> |

In more detail, this library runs the npm query .workspaces command to retrieve a list of all `package.json` files across the workspaces in the monorepo.
It then checks if any commits from the last release have modified any workspace listed as a dependency, devDependency, or peerDependency for the current workspace.

If such modifications are found, those commits are included in the list of commits for the dependent workspace, even if the workspace itself was not directly changed.

### tagFormat

To prevent version conflicts, git tags are created with a namespace that incorporates the name of the package, such as
`my-package-name@1.0.1`. To change this default setting, specify a
[tagFormat](https://semantic-release.gitbook.io/semantic-release/usage/configuration#tagformat) key in the `.releaserc`.

⚠️ **Remember**, it's essential to choose a format that ensures each workspace/release is unique.

## Custom Release Logic with processCommits

The `.releaserc` configuration allows an optional `processCommits` function, enabling you to define custom logic to include additional commits based on specific requirements.
This function provides flexibility for more advanced use cases where the default commit filtering behavior doesn't cover your needs.

### How it Works

The `processCommits` function receives an array of `CommitWithFilePaths` objects.
Each object contains the usual commit data, plus a `filePaths` array listing all the file paths changed in the commit.
You can use this information to add custom conditions for determining whether certain commits should trigger a release.

For example, you may want to include specific commits based on custom file path patterns, metadata in commit messages, or some external conditions.

### Example Use Case

Imagine you have a monorepo and want to trigger a release not only when relevant files are changed but also based on specific commit messages or tags that are used for triggering feature-specific releases.

In the following example, the `processCommits` function will include additional commits if they contain a specific tag in the commit message, such as `[release:docs]`, to force a release for documentation updates:

```javascript
export default {
    branches: ['main'],
    plugins: [
        '@semantic-release/commit-analyzer', 
        '@semantic-release/release-notes-generator'
    ],
    processCommits(commitsWithFilePaths) {
        const customTriggerCommits = commitsWithFilePaths.filter((commit) => {
            // Include commits with a specific tag in the message for custom releases
            return commit.message.includes('[release:docs]') || 
                   commit.message.includes('[release:hotfix]');
        });

        // You can also perform additional checks based on file paths or other conditions
        const filePathFilteredCommits = commitsWithFilePaths.filter((commitWithFilePath) => {
            return commitWithFilePath.filePaths.some((filePath) =>
                filePath.startsWith('docs/') || filePath.startsWith('hotfix/')
            );
        });

        // Combine custom-triggered commits with those affected by file paths
        return [...customTriggerCommits, ...filePathFilteredCommits];
    },
}
```
