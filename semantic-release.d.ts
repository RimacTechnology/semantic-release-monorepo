declare module 'semantic-release/lib/get-config.js' {
    import type {
        AddChannelContext,
        AnalyzeCommitsContext,
        BaseContext,
        Config,
        FailContext,
        GenerateNotesContext,
        Options,
        PrepareContext,
        PublishContext,
        SuccessContext,
        VerifyConditionsContext,
    } from 'semantic-release'
    import type { CommitWithFilePaths } from './src/utils.types'

    export type SemanticConfigType = {
        options: {
            processCommits?(commits: CommitWithFilePaths): CommitWithFilePaths[]
        }
        plugins: {
            addChannel(context: AddChannelContext): Promise<unknown>
            analyzeCommits(context: AnalyzeCommitsContext): Promise<unknown>
            fail(context: FailContext): Promise<unknown>
            generateNotes(context: GenerateNotesContext): Promise<string>
            prepare(context: PrepareContext): Promise<unknown>
            publish(context: PublishContext): Promise<unknown[]>
            success(context: SuccessContext): Promise<unknown>
            verifyConditions(context: VerifyConditionsContext): Promise<unknown>
        }
    }

    export default function (
        context: Config & Pick<BaseContext, 'logger'>,
        options: Options,
    ): Promise<SemanticConfigType>
}
