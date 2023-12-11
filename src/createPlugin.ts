import type {
    AnalyzeCommitsContext,
    Config,
    GenerateNotesContext,
    PrepareContext,
    PublishContext,
} from 'semantic-release'
import type { SemanticConfigType } from 'semantic-release/lib/get-config.js'

import {
    modifyContextCommits,
    modifyContextReleaseVersion,
} from './utils.js'

export function createInlinePlugin(semanticConfig: SemanticConfigType) {
    const analyzeCommits = async (_: Config, context: AnalyzeCommitsContext) => {
        return semanticConfig.plugins.analyzeCommits(modifyContextCommits(context))
    }

    const generateNotes = async (_: Config, context: GenerateNotesContext) => {
        return semanticConfig.plugins.generateNotes(modifyContextCommits(modifyContextReleaseVersion(context)))
    }

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

    Object.values(inlinePlugin).forEach((value) =>
        Reflect.defineProperty(value, 'pluginName', {
            enumerable: true,
            value: '@rimac-technology/monorepo-inline-plugin',
            writable: false,
        }))

    return inlinePlugin
}
