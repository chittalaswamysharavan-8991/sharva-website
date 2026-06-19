const js = require("@eslint/js");
const globals = require("globals");
const reactHooks = require("eslint-plugin-react-hooks");
const reactRefresh = require("eslint-plugin-react-refresh").default;

module.exports = [
  {
    ignores: [
      ".deps/**",
      "dist/**",
      "node_modules/**",
      "outputs/**",
      "reports/**",
      "test-results/**"
    ]
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      parserOptions: {
        ecmaFeatures: { jsx: true }
      },
      sourceType: "module"
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "none",
          varsIgnorePattern: "^React$"
        }
      ]
    }
  },
  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      globals: globals.browser
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    rules: {
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ]
    }
  },
  {
    files: ["src/main.jsx"],
    rules: {
      "react-refresh/only-export-components": "off"
    }
  },
  {
    files: [
      "api/**/*.js",
      "eslint.config.js",
      "playwright.config.js",
      "scripts/**/*.js"
    ],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs"
    }
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: globals.node
    }
  },
  {
    files: ["public/sw.js"],
    languageOptions: {
      globals: globals.serviceworker
    }
  }
];
