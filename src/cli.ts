#!/usr/bin/env node

import { createRequire } from 'node:module'

import { cosmiconfig } from 'cosmiconfig'
import meow from 'meow'
import { readPackage } from 'read-pkg'
import type { Options } from 'semantic-release'
import semanticRelease from 'semantic-release'
import semanticGetConfig from 'semantic-release/lib/get-config.js'

import pkg from '../package.json' with { type: 'json' }

import { createInlinePlugin } from './createPlugin.js'
import { RescopedStream, VoidStream } from './stream.js'

const { Signale } = createRequire(import.meta.url)('signale')

const cli = meow(
    `
    Usage
        $ semantic-release-monorepo

    Options
        --ci        Set to false to skip Continuous Integration environment verifications
        --debug     Output debugging information. 
        --dry-run   Dry run mode.

    Examples
        $ semantic-release-monorepo --debug
`,
    {
        flags: {},
        importMeta: import.meta,
    },
)

try {
    const monoPackage = await readPackage().catch(() => null)
    const rawSemanticConfig = await cosmiconfig('release').search()

    const options: Options = {
        tagFormat: monoPackage ? `${monoPackage.name}@\${version}` : undefined,
        ...rawSemanticConfig?.config,
        ...cli.flags,
    }

    const monoContext = {
        cwd: process.cwd(),
        env: process.env,
        stderr: process.stderr,
        stdout: process.stdout,
    }

    const semanticConfig = await semanticGetConfig(
        {
            ...monoContext,
            logger: new Signale({ stream: new VoidStream(1) }),
        },
        options,
    )

    const inlinePlugin = createInlinePlugin(semanticConfig)

    await semanticRelease(
        { ...options, ...inlinePlugin },
        {
            cwd: monoContext.cwd,
            env: monoContext.env,
            stderr: new RescopedStream(monoContext.stderr, pkg.name),
            stdout: new RescopedStream(monoContext.stdout, pkg.name),
        },
    )

    process.exit(0)
} catch (error) {
    console.error(`[${pkg.name}]:`, error)
    process.exit(1)
}
