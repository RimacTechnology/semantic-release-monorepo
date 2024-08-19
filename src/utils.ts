import { execSync } from 'node:child_process'
import { EOL } from 'node:os'
import { dirname, extname, normalize, sep } from 'node:path'
import { cwd } from 'node:process'

import memize from 'memize'
import type { SemanticConfigType } from 'semantic-release/lib/get-config.js'

import type { CommitWithFilePaths, ContextWithCommits, ContextWithVersion, WorkspaceJSON } from './utils.types.js'

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

export const memoizedGetWorkspaceManifest = memize(() => {
    try {
        const workspaces: WorkspaceJSON[] = JSON.parse(execSync('npm query .workspace').toString())
        const workingDirectory = cwd()

        const currentWorkspace = workspaces.find((workspace) => {
            return workspace.path.startsWith(workingDirectory)
        })

        if (!currentWorkspace) {
            return null
        }

        const currentWorkspaceDependencies = workspaces.filter((workspace) => {
            return (
                workspace.name in (currentWorkspace.dependencies ?? {}) ||
                workspace.name in (currentWorkspace.devDependencies ?? {}) ||
                workspace.name in (currentWorkspace.peerDependencies ?? {})
            )
        })

        return {
            location: currentWorkspace.location,
            dependantWorkspaces: currentWorkspaceDependencies.map((currentWorkspaceDependency) => {
                return { location: currentWorkspaceDependency.location }
            }),
        }
    } catch {
        return null
    }
})

export function modifyContextCommits<TContextType extends ContextWithCommits>(
    context: TContextType,
    semanticConfig: SemanticConfigType,
): TContextType {
    const currentWorkspace = memoizedGetWorkspaceManifest()

    const commitsWithFilePaths = context.commits.map((commit) => {
        return {
            ...commit,
            filePaths: memoizedGit(`diff-tree --root --no-commit-id --name-only -r ${commit.hash}`).split(EOL),
        }
    })

    const affectedCommits: CommitWithFilePaths[] = []

    if (currentWorkspace) {
        affectedCommits.push(
            ...commitsWithFilePaths.filter((commitWithFilePaths) => {
                return commitWithFilePaths.filePaths.some((commitFilePath) => {
                    return (
                        memoizedIsPathWithin(currentWorkspace.location, commitFilePath) ||
                        currentWorkspace.dependantWorkspaces.some((dependantWorkspace) =>
                            memoizedIsPathWithin(dependantWorkspace.location, commitFilePath),
                        )
                    )
                })
            }),
        )
    }

    if (semanticConfig.options.processCommits) {
        affectedCommits.push(
            ...semanticConfig.options.processCommits(
                commitsWithFilePaths.filter((commitWithFilePaths) => {
                    return !affectedCommits.some((affectedCommit) => {
                        return commitWithFilePaths.hash === affectedCommit.hash
                    })
                }),
            ),
        )
    }

    return {
        ...context,
        commits: affectedCommits,
    }
}
