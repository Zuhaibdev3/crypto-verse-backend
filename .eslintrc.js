// {
//   "rules": {
//     "@typescript-eslint/naming-convention": "off",
//     "@typescript-eslint/ban-ts-comment": "off",
//     "@typescript-eslint/no-explicit-any": "off",
//     "@typescript-eslint/explicit-function-return-types": "off",
//     "@typescript-eslint/explicit-module-boundary-types": "off"
//   },
//   "extends": [
//     "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
//     "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
//     "plugin:prettier/recommended" // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
//   ],
//   "parser": "@typescript-eslint/parser",
//   "parserOptions": {
//     "ecmaVersion": 2020, // Allows for the parsing of modern ECMAScript features
//     "sourceType": "module" // Allows for the use of imports
//   },
//   "env": {
//     "node": true
//   }
// }

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020, // Allows the use of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  extends: [
    "plugin:@typescript-eslint/recommended",  // Uses the linting rules from @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint",  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended"    // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  env: {
    node: true, // Enable Node.js global variables
  },
  rules: {
    'no-console': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-types": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  },
};