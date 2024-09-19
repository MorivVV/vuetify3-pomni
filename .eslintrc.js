/**
 * .eslint.js
 *
 * ESLint configuration file.
 */

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "vuetify",
    "@vue/eslint-config-typescript",
    "./.eslintrc-auto-import.json",
  ],
  rules: {
    "vue/multi-word-component-names": "off",
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "vue/script-indent": "off",
    "arrow-parens": "off",
    "vue/custom-event-name-casing": "off",
  },
};
