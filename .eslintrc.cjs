/** @type { import('@types/eslint').ESLint.ConfigData } */
module.exports = {
    extends: [require.resolve('@rimac-technology/style-guide/eslint/core')],
    ignorePatterns: [
        '*generated*',
        'dist',
        '!.*.js',
        '!.*.cjs',
        '!.*.mjs',
        '!.*.ts',
    ],
    overrides: [{ files: ['./**/*.{js,cjs,mjs,ts}'] }],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.lint.json',
    },
}
