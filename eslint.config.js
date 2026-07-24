// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      // As telas carregam dados externos ao serem montadas, conforme o padrão
      // de useEffect adotado nas aulas do projeto.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
