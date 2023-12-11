import type {
    AnalyzeCommitsContext,
    Config,
    PrepareContext,
    SuccessContext,
    VerifyReleaseContext,
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

    const generateNotes = async (_: Config, context: VerifyReleaseContext) => {
        return semanticConfig.plugins.generateNotes(modifyContextCommits(modifyContextReleaseVersion(context)))
    }

    const prepare = async (_: Config, context: PrepareContext) => {
        return semanticConfig.plugins.prepare(modifyContextCommits(modifyContextReleaseVersion(context)))
    }

    const success = async (_: Config, context: SuccessContext) => {
        return semanticConfig.plugins.success(modifyContextCommits(modifyContextReleaseVersion(context)))
    }

    const inlinePlugin = {
        analyzeCommits,
        generateNotes,
        prepare,
        success,
    }

    Object.values(inlinePlugin).forEach((value) =>
        Reflect.defineProperty(value, 'pluginName', {
            enumerable: true,
            value: '@rimac-technology/monorepo-inline-plugin',
            writable: false,
        }))

    return inlinePlugin
}
