module.exports = {
    // Specifies the ESLint parser
    parser: '@typescript-eslint/parser',
    extends: [
        // Uses the recommended rules from @eslint-plugin-react
        'plugin:react/recommended',
        // Uses the recommended rules from @typescript-eslint/eslint-plugin
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier/@typescript-eslint'
    ],
    parserOptions: {
        // Allows for the parsing of modern ECMAScript features
        ecmaVersion: 2020,
        // Allows for the use of imports
        sourceType: 'module',
        ecmaFeatures: {
            // Allows for the parsing of JSX
            jsx: true
        }
    },
    rules: {
        'prettier/prettier': 'error',
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'prefer-const': 'error',
        'no-var': 'error',
        'no-multiple-empty-lines': 'error',
        '@typescript-eslint/eslint-disable-next-line': 'semi',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
        'react-hooks/exhaustive-deps': 'warn' // Checks effect dependencies
    },
    settings: {
        react: {
            // Tells eslint-plugin-react to automatically detect the version of React to use
            version: 'detect'
        }
    },
    env: {
        browser: true
    }
}
