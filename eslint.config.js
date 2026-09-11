import js from "@eslint/js";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat["recommended-latest"],
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      "react-refresh": reactRefresh,
    },
    rules: {
      // DemoReel ignora de propósito mensagens postMessage que não são o
      // JSON esperado do player do Vimeo (evento de outra origem, etc.).
      "no-empty": ["error", { allowEmptyCatch: true }],
      "react-refresh/only-export-components": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "no-unsafe-finally": "off",
      "no-unused-vars": "off",
      "react/jsx-key": "off",
      // Vários rótulos de seção no site são propositalmente escritos como
      // "// NOME" (BestWork, Blog, SecaoAbout) — é conteúdo visível de
      // design, não um comentário esquecido. Confirmado na prática: a
      // "correção" ingênua dessa regra apaga o texto da tela.
      "react/jsx-no-comment-textnodes": "off",
    },
  },
];
