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
                        release: 'patch',
                        type: 'refactor',
                    },
                    {
                        release: 'patch',
                        type: 'chore',
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
                            section: 'Features',
                            type: 'feat',
                        },
                        {
                            section: 'Bug Fixes',
                            type: 'fix',
                        },
                        {
                            section: 'Code Refactoring',
                            type: 'refactor',
                        },
                        {
                            section: 'Other',
                            type: 'chore',
                        },
                        {
                            section: 'Performance Improvements',
                            type: 'perf',
                        },
                        {
                            section: 'Reverts',
                            type: 'revert',
                        },
                    ],
                },
            },
        ],
        '@semantic-release/npm',
        '@semantic-release/git',
        '@semantic-release/github',
    ],
}
