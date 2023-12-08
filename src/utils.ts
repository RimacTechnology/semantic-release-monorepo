import { execSync } from 'node:child_process'
import { EOL } from 'node:os'
import {
    normalize,
    relative,
    resolve,
    sep,
} from 'node:path'

import { packageUpSync } from 'package-up'
import type { Commit } from 'semantic-release'

import type {
    CommitWithFiles,
    ContextWithCommits,
    ContextWithVersion,
} from './utils.types'

function git(args: string[]): string {
    return execSync(['git', ...args].join(' '))
        .toString()
        .trim()
}

function getCommitsWithFiles(commits: readonly Commit[]): CommitWithFiles[] {
    return commits.map((commit) => {
        return {
            ...commit,
            files: git(['diff-tree', '--root', '--no-commit-id', '-n', '-r', commit.hash]).split(EOL),
        }
    })
}

function getPackagePath(): string {
    const packagePath = packageUpSync()

    if (!packagePath) {
        throw new Error('Unable to determine the package path')
    }

    return relative(git(['rev-parse', '--show-toplevel']), resolve(packagePath, '...'))
}

export function modifyContextReleaseVersion<TContextType extends ContextWithVersion>(context: TContextType): TContextType {
    return {
        ...context,
        nextRelease: {
            ...context.nextRelease,
            // @ts-expect-error
            // eslint-disable-next-line no-template-curly-in-string -- Semantic release template
            version: context.options.tagFormat.replace('${version}', context.nextRelease.version),
        },
    }
}

export function modifyContextCommits<TContextType extends ContextWithCommits>(context: TContextType): TContextType {
    const packagePath = getPackagePath()
    const packagePathSegments = packagePath.split(sep)

    const commits = getCommitsWithFiles(context.commits).filter((commit) => {
        const packageFile = commit.files.find((file) => {
            const fileSegments = normalize(file).split(sep)

            return packagePathSegments.every((packageSegment, index) => {
                return packageSegment === fileSegments[index]
            })
        })

        if (packageFile) {
            context.logger.log(`Including commit "${commit.subject}" because it modified package file "${packageFile}"`)
        }

        return Boolean(packageFile)
    })

    return {
        ...context,
        commits,
    }
}
