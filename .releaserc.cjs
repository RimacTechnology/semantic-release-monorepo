module.exports = {
    branches: [
        '+([0-9])?(.{+([0-9]),x}).x',
        'master',
        {
            name: 'beta',
            prerelease: true,
        },
        {
            name: 'alpha',
            prerelease: true,
        },
    ],
    plugins: [
        [
            '@semantic-release/commit-analyzer',
            {
                preset: 'angular',
                releaseRules: [
                    {
                        type: 'refactor',
                        release: 'patch',
                    },
                    {
                        type: 'chore',
                        release: 'patch',
                    },
                ],
            },
        ],
        [
            '@semantic-release/release-notes-generator',
            {
                preset: 'conventionalcommits',
                presetConfig: {
                    types: [
                        {
                            type: 'feat',
                            section: 'Features',
                        },
                        {
                            type: 'fix',
                            section: 'Bug Fixes',
                        },
                        {
                            type: 'refactor',
                            section: 'Code Refactoring',
                        },
                        {
                            type: 'chore',
                            section: 'Other',
                        },
                        {
                            type: 'perf',
                            section: 'Performance Improvements',
                        },
                        {
                            type: 'revert',
                            section: 'Reverts',
                        },
                    ],
                }
            },
        ],
        '@semantic-release/changelog',
        '@semantic-release/npm',
        '@semantic-release/git',
        '@semantic-release/github',
    ],
}
