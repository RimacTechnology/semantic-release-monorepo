#!/usr/bin/env node

import meow from 'meow'
import { readPackage } from 'read-pkg'
import type { Options } from 'semantic-release'
import semanticRelease from 'semantic-release'
import semanticGetConfig from 'semantic-release/lib/get-config.js'
import { Signale } from 'signale'

import { createInlinePlugin } from './createPlugin.js'
import {
    RescopedStream,
    VoidStream,
} from './stream.js'

const cli = meow(`
    Usage
        $ semantic-release-monorepo

    Options
        --ci        Set to false to skip Continuous Integration environment verifications
        --debug     Output debugging information. 
        --dry-run   Dry run mode.

    Examples
        $ semantic-release-monorepo --debug
`, {
    flags: {
        ci: {
            type: 'boolean',
        },
        debug: {
            type: 'boolean',
        },
        dryRun: {
            type: 'boolean',
        },
    },
    importMeta: import.meta,
})

async function main(flags = cli.flags) {
    try {
        const monoPackage = await readPackage()

        const options: Options = {
            ...flags,
            tagFormat: `${monoPackage.name}@\${version}`,
        }

        const monoContext = {
            cwd: process.cwd(),
            env: process.env,
            stderr: process.stderr,
            stdout: process.stdout,
        }

        const semanticConfig = await semanticGetConfig({
            cwd: monoContext.cwd,
            env: monoContext.env,
            logger: new Signale({ stream: new VoidStream(1) }),
        }, options)

        const inlinePlugin = createInlinePlugin(semanticConfig)

        await semanticRelease({ ...options, ...inlinePlugin }, {
            cwd: monoContext.cwd,
            env: monoContext.env,
            stderr: new RescopedStream(monoContext.stderr, monoPackage.name),
            stdout: new RescopedStream(monoContext.stdout, monoPackage.name),
        })

        process.exit(0)
    } catch (error) {
        console.error('[semantic-release-monorepo]:', error)
        process.exit(1)
    }
}

void main()

