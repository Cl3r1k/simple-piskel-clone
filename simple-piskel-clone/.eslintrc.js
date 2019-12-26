module.exports = {
    env: {
        es6: true,
        browser: true,
        node: true,
        jest: true  // Consider to add jest support to es-lint
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    plugins: [
        'import',
        'prettier',
    ],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    rules: {
        'linebreak-style': 'off', // Not correct work in Windows.

        'arrow-parens': 'off', // Incompatible with prettier
        'object-curly-newline': 'off', // Incompatible with prettier
        'no-mixed-operators': 'off', // Incompatible with prettier
        'arrow-body-style': 'off', // Is it not our style?
        'function-paren-newline': 'off', // Incompatible with prettier
        'no-plusplus': 'off',
        'space-before-function-paren': 0, // Incompatible with prettier

        'max-len': ['error', 120, 2, { ignoreUrls: true, }], // airbnb allows some boundary limits
        'no-console': 'error', // airbnb uses warning
        'no-alert': 'error', // airbnb uses warning

        'no-param-reassign': 'off', // Is it not our style?
        "radix": "off", // parseInt, parseFloat and radix are switched off. It's not Ok.

        // 'class-methods-use-this': 'off',
        // 'prefer-destructuring': 'off',

        'prettier/prettier': ['error'],
    },
};