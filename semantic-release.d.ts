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

    export type SemanticConfigType = {
        plugins: {
            addChannel(context: AddChannelContext): Promise<unknown>
            analyzeCommits(context: AnalyzeCommitsContext): Promise<unknown>
            fail(context: FailContext): Promise<unknown>
            generateNotes(context: GenerateNotesContext): Promise<unknown>
            prepare(context: PrepareContext): Promise<unknown>
            publish(context: PublishContext): Promise<unknown>
            success(context: SuccessContext): Promise<unknown>
            verifyConditions(context: VerifyConditionsContext): Promise<unknown>
        }
    }

    export default async function(
        context: Config & Pick<BaseContext, 'logger'>,
        options: Options
    ): Promise<SemanticConfigType>
}
