const globals = require('globals');
const hexo = require('eslint-config-hexo/eslint');
const json = require('eslint-plugin-json');
const mocha = require('eslint-plugin-mocha');
const react = require('eslint-plugin-react');

module.exports = [
    {
        ignores: ['node_modules/', 'test/.tmp/', 'package-lock.json']
    },
    ...hexo.map(config => Object.assign({ files: ['**/*.js', '**/*.jsx'] }, config)),
    {
        files: ['**/*.js', '**/*.jsx'],
        plugins: { react },
        languageOptions: {
            ecmaVersion: 'latest',
            // As before the flat config: no 'use strict' required in CommonJS files.
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true }
            }
        },
        settings: {
            react: { version: '16.0' },
            n: { tryExtensions: ['.js', '.jsx', '.json'] }
        },
        rules: {
            ...react.configs.flat.recommended.rules,
            'indent': ['error', 4, { SwitchCase: 1 }],
            // ESLint 8 behaviour: unused `catch (e)` bindings are fine
            'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
            'react/jsx-uses-vars': 'error',
            'react/no-unknown-property': ['error', {
                ignore: ['class', 'onclick', 'onload', 'onsubmit', 'onerror', 'crossorigin']
            }],
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/jsx-key': 'off',
            'react/jsx-no-target-blank': ['error', { allowReferrer: true }]
        }
    },
    // Scripts that run in the browser
    {
        files: ['source/js/**/*.js'],
        languageOptions: {
            globals: { ...globals.browser, ...globals.jquery }
        },
        rules: {
            'n/no-unsupported-features/node-builtins': 'off'
        }
    },
    // Test suite (needs a newer Node.js than the theme itself)
    {
        files: ['test/**/*.js'],
        settings: {
            n: { version: '>=20.19.0' }
        },
        rules: {
            'n/no-unpublished-require': 'off',
            // stable in practice on the Node.js versions the tests run on
            'n/no-unsupported-features/node-builtins': ['error', { ignores: ['fs.cpSync'] }]
        }
    },
    // mocha test files
    {
        files: ['test/unit/**/*.test.js', 'test/integration/**/*.test.js'],
        plugins: { mocha },
        languageOptions: {
            globals: { ...globals.mocha }
        },
        rules: {
            ...mocha.configs.flat.recommended.rules,
            'mocha/no-mocha-arrows': 'off',
            'mocha/max-top-level-suites': 'off',
            // tests are generated from data tables inside describe()
            'mocha/no-setup-in-describe': 'off'
        }
    },
    {
        files: ['test/support/known-bug.js'],
        languageOptions: {
            globals: { ...globals.mocha }
        }
    },
    {
        files: ['test/e2e/**/*.js'],
        languageOptions: {
            globals: { ...globals.browser }
        },
        rules: {
            // page.evaluate() callbacks run in the browser
            'n/no-unsupported-features/node-builtins': 'off'
        }
    },
    {
        files: ['**/*.json'],
        ...json.configs.recommended
    }
];
