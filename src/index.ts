import { readPackageSync } from 'read-pkg'

import {
    modifyContextCommits,
    modifyContextReleaseVersion,
} from './utils'
import { wrapStep } from './wrapStep'

export const tagFormat = `${readPackageSync().name}-v\${version}`

export const analyzeCommits = wrapStep('analyzeCommits', (plugin) => async (config, context) => {
    return plugin(config, modifyContextCommits(context))
})

export const generateNotes = wrapStep('generateNotes', (plugin) => async (config, context) => {
    return plugin(config, modifyContextCommits(modifyContextReleaseVersion(context)))
})

export const prepare = wrapStep('prepare', (plugin) => async (config, context) => {
    return plugin(config, modifyContextCommits(modifyContextReleaseVersion(context)))
})

export const success = wrapStep('success', (plugin) => async (config, context) => {
    return plugin(config, modifyContextCommits(modifyContextReleaseVersion(context)))
})
