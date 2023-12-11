import type {
    BaseContext,
    Commit,
    NextRelease,
} from 'semantic-release'

export interface ContextWithCommits extends BaseContext {
    /**
     * An array of commits representing a series of changes made to a software project.
     *
     */
    commits: readonly Commit[]
}

export interface ContextWithVersion extends BaseContext {
    /**
     * Represents the next release of the software.
     *
     */
    nextRelease: NextRelease
}
