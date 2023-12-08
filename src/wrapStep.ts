import type {
    AnalyzeCommitsContext,
    BaseContext,
    Config,
    GenerateNotesContext,
    PrepareContext,
    SuccessContext,
} from 'semantic-release'

import type {
    BaseContextWithOptions,
    StepFunctionType,
    WrapStepFunctionType,
} from './wrapStep.types'

export function wrapStep(
    stepName: 'analyzeCommits',
    stepFunction: WrapStepFunctionType<AnalyzeCommitsContext>,
): StepFunctionType[]
export function wrapStep(
    stepName: 'generateNotes',
    stepFunction: WrapStepFunctionType<GenerateNotesContext>,
): StepFunctionType[]
export function wrapStep(
    stepName: 'prepare',
    options: WrapStepFunctionType<PrepareContext>,
): StepFunctionType[]
export function wrapStep(
    stepName: 'success',
    stepFunction: WrapStepFunctionType<SuccessContext>,
): StepFunctionType[]

export function wrapStep(
    stepName: 'analyzeCommits' | 'generateNotes' | 'prepare' | 'success',
    stepFunction: WrapStepFunctionType<any>
): StepFunctionType[] {
    const wrappers = []

    for (let iterator = 0; iterator < 10; iterator += 1) {
        const pluginFunction = async (_: Config, context: BaseContext) => {
            const plugins = (context as BaseContextWithOptions).options?.plugins ?? []

            if (plugins.length <= iterator) {
                context.logger.log('No more plugins.')

                return
            }

            const pluginDefinition = plugins.at(iterator)
            const [pluginName, pluginConfig] = Array.isArray(pluginDefinition) ? pluginDefinition : [pluginDefinition, {}]

            if (!pluginName) {
                context.logger.log(`Falsy plugin name at index "${iterator}" for step "${stepName}"`)

                return
            } else if (typeof pluginName !== 'string') {
                throw new TypeError(`Incorrect plugin name type. Expected "string" but was "${typeof pluginName}"`)
            }

            const plugin = await import(pluginName)
            const step = plugin?.[stepName]

            if (!step) {
                context.logger.log(`Plugin "${pluginName}" does not provide step "${stepName}"`)

                return
            }

            context.logger.log(`Start step "${stepName}" of plugin "${pluginName}"`)

            const stepResult = stepFunction(step)(pluginConfig, context)

            void stepResult.then(() => {
                context.logger.log(`Completed step "${stepName}" of plugin "${pluginName}"`)
            })

            return stepResult
        }

        Object.defineProperty(pluginFunction, 'name', { value: 'semantic-release-monorepo' })

        wrappers.push(pluginFunction)
    }

    return wrappers
}
