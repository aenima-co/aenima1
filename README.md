# 🚀 Aenima — Frontend

Site portfólio da Aenima, feito em React + Vite. Consome o Strapi de [`aenima-backend`](https://github.com/aenima-co/aenima-backend) como CMS headless.

---

## ⚙️ Configuração do ambiente

### Pré-requisitos

- [Node.js](https://nodejs.org/) v20 ou superior
- [npm](https://www.npmjs.com/)
- O backend (`aenima-backend`) rodando localmente (`npm run develop`, porta padrão 1337) — ou uma URL de um backend já publicado

### 1. Clone e instale

```bash
git clone <url-do-repositorio>
cd aenima1
npm install
```

### 2. Variáveis de ambiente

Não usadas em desenvolvimento normal — o app já assume `http://localhost:1337` como backend por padrão (ver `src/config.js`). Só precisa de um `.env.local` (nunca commitado, ver `.gitignore`) se quiser:

```env
# Apontar pra um backend diferente do local (ex: produção, pra testar algo específico)
VITE_STRAPI_URL=https://aenima-backend.onrender.com

# Ativar o Sentry localmente (por padrão fica desligado em dev — sem essa
# variável, Sentry.init nunca roda, então nada é reportado durante testes locais)
VITE_SENTRY_DSN=
```

Em produção, as duas vêm de secrets do GitHub Actions (`VITE_STRAPI_URL`, `VITE_SENTRY_DSN`) — ver `.github/workflows/deploy.yml` e `.env.production`.

> ⚠️ **A porta do `npm run dev` importa**: o backend só libera CORS pra `localhost:5173` e `localhost:5174` (ver `SECURITY.md` do `aenima-backend`). Se essas duas portas estiverem ocupadas e o Vite subir em outra, as chamadas à API vão falhar com erro de CORS — parece "backend fora do ar", mas não é.

---

## 🛠️ Comandos

```bash
npm run dev       # desenvolvimento, com hot reload
npm run build     # build de produção (pasta dist/)
npm run preview   # serve o build de produção localmente, pra conferir antes de publicar
npm run lint      # ESLint — deve sempre sair com 0 erros
```

---

## 🗺️ Arquitetura, em resumo

- **Roteamento**: `HashRouter` (react-router-dom) — URLs como `/#/about`, `/#/work`. Escolhido porque o site é hospedado no GitHub Pages, que não tem suporte nativo a fallback de rota pra SPA; com hash, o navegador sempre pede só o `index.html`, então não precisa de configuração de servidor nenhuma.
- **Conteúdo**: quase tudo vem do Strapi (`src/api.js` centraliza as chamadas). Textos de sistema (erros, estados vazios, alguns aria-label) ficam no código (`src/i18n/messages.js`) em vez do CMS — ver `KNOWN_ISSUES.md` pra entender por quê.
- **Tratamento de erro**: qualquer componente que busca dado do Strapi reporta falha pro `LoadErrorContext` (`src/contexts/LoadErrorContext.jsx`) — um card central aparece com botão de "Tentar novamente" se qualquer coisa falhar, e a mesma falha é reportada pro Sentry (`src/sentry.js`).
- **Idioma**: `LanguageContext` (`src/contexts/LanguageContext.jsx`) controla PT/EN — atualiza tanto o conteúdo (via `locale` passado pra API do Strapi) quanto o atributo `<html lang>` da página.

Para decisões técnicas específicas (por que algo foi feito de um jeito não óbvio) ver `KNOWN_ISSUES.md`. Para os serviços externos que o projeto depende (hospedagem, monitoramento, etc.) ver `EXTERNAL_SERVICES.md` no `aenima-backend`.

---

## 🚀 Deploy

Automático: todo push na `main` roda `.github/workflows/deploy.yml` (build + publica no GitHub Pages). Sem gate de lint/teste no CI — rodar `npm run lint` e `npm run build` localmente antes de mesclar é o que garante que o deploy não vai quebrar.
