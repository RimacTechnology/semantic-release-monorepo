import { execSync } from 'node:child_process'
import { EOL } from 'node:os'
import { dirname, extname, normalize, relative, resolve, sep } from 'node:path'

import memize from 'memize'
import { packageUpSync } from 'package-up'

import type { ContextWithCommits, ContextWithVersion } from './utils.types.js'

const memoizedIsPathWithin = memize((path: string, childPath: string): boolean => {
    const normalizedPath = normalize(path)
    const normalizedChildPath = normalize(childPath)

    const childSegmentPath =
        extname(normalizedChildPath) !== '' ? dirname(normalizedChildPath).split(sep) : normalizedChildPath.split(sep)

    return normalizedPath.split(sep).every((pathSegment, index) => {
        return pathSegment === childSegmentPath[index]
    })
})

const memoizedGit = memize((args: string): string => {
    return execSync(`git ${args}`).toString().trim()
})

function getPackagePath(): string | null {
    const packagePath = packageUpSync()

    if (!packagePath) {
        return null
    }

    return relative(memoizedGit('rev-parse --show-toplevel'), resolve(packagePath, '..'))
}

export function modifyContextReleaseVersion<TContextType extends ContextWithVersion>(
    context: TContextType,
): TContextType {
    return {
        ...context,
        nextRelease: {
            ...context.nextRelease,
            // @ts-expect-error
            version: context.options.tagFormat.replace('${version}', context.nextRelease.version),
        },
    }
}

export function modifyContextCommits<TContextType extends ContextWithCommits>(context: TContextType): TContextType {
    const packagePath = getPackagePath()

    const commits = context.commits.filter((commit) =>
        memoizedGit(`diff-tree --root --no-commit-id --name-only -r ${commit.hash}`)
            .split(EOL)
            .some((commitFilePath) => memoizedIsPathWithin(packagePath, commitFilePath)),
    )

    return {
        ...context,
        commits,
    }
}
