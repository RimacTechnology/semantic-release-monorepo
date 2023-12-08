import type {
    BaseContext,
    Config,
    Options,
} from 'semantic-release'

export interface BaseContextWithOptions extends BaseContext {
    /**
     * Semantic release core plugins options.
     *
     */
    options?: Options
}

export type StepFunctionType<TContextType = BaseContext> = (
    (config: Config, context: TContextType) => Promise<unknown>
)

export type WrapStepFunctionType<TContextType = BaseContext> = (
    (plugin: StepFunctionType<TContextType>) => StepFunctionType<TContextType>
)
