import type {
    AnalyzeCommitsContext,
    Config,
    GenerateNotesContext,
    PrepareContext,
    PublishContext,
} from 'semantic-release'
import type { SemanticConfigType } from 'semantic-release/lib/get-config.js'

import { modifyContextCommits, modifyContextReleaseVersion } from './utils.js'

export function createInlinePlugin(semanticConfig: SemanticConfigType) {
    // biome-ignore lint/suspicious/useAwait: semantic-release expect steps to return Promise
    const analyzeCommits = async (_: Config, context: AnalyzeCommitsContext) => {
        return semanticConfig.plugins.analyzeCommits(modifyContextCommits(context))
    }

    // biome-ignore lint/suspicious/useAwait: semantic-release expect steps to return Promise
    const generateNotes = async (_: Config, context: GenerateNotesContext) => {
        return semanticConfig.plugins.generateNotes(modifyContextCommits(modifyContextReleaseVersion(context)))
    }

    // biome-ignore lint/suspicious/useAwait: semantic-release expect steps to return Promise
    const prepare = async (_: Config, context: PrepareContext) => {
        return semanticConfig.plugins.prepare(modifyContextCommits(context))
    }

    const publish = async (_: Config, context: PublishContext) => {
        const [response] = await semanticConfig.plugins.publish(modifyContextCommits(context))

        return response ?? {}
    }

    const inlinePlugin = {
        analyzeCommits,
        generateNotes,
        prepare,
        publish,
    }

    for (const value of Object.values(inlinePlugin)) {
        Reflect.defineProperty(value, 'pluginName', {
            enumerable: true,
            value: '@rimac-technology/monorepo-inline-plugin',
            writable: false,
        })
    }

    return inlinePlugin
}
