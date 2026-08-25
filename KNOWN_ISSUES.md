# Pontos de atenção conhecidos

Coisas que não são bugs pra corrigir agora, mas ficam registradas pra não serem esquecidas.

## Blog sem conteúdo real (seção escondida de propósito)

A seção "// BLOG" da Home (`src/components/Blog/Blog.jsx`) está com `display: none` em [`Blog.css:5`](src/components/Blog/Blog.css#L5), sem nenhuma media query que reative isso em nenhuma largura de tela — fica sempre escondida, em qualquer dispositivo. Isso é intencional: ainda não há posts reais pra mostrar, só um post de exemplo/placeholder ("The Birth of Venus") cadastrado no Strapi.

**O que falta, pra quando houver conteúdo real:**

1. **Remover o `display: none`** de `.blog` em `Blog.css`.
2. **Criar a página de detalhe do post**, seguindo o mesmo padrão já usado pro Work:
   - Rota `/blog/:slug` em `src/App.jsx` (hoje só existe `/blog`, a listagem — não existe rota de detalhe, nem componente de página, nem função na API pra buscar um post específico).
   - Componente de página nos moldes de `src/pages/PortfolioPage/PortfolioPage.jsx` (que já faz esse papel para `/work/:slug`).
   - Função `getPostBySlug()` (ou similar) em `src/api.js`, análoga à `getWorkBySlug()` já existente.
3. Os cards de post na Home (`Blog.jsx`) e na listagem (`src/pages/BlogPage/BlogPage.jsx`) linkam pra `/blog/:slug` — hoje esse link não navega pra lugar nenhum útil (rota inexistente), mas como a seção está escondida, ninguém consegue clicar nele por enquanto.

## Página 404

`src/pages/NotFoundPage/NotFoundPage.jsx`, capturada pela rota curinga (`<Route path="*">`) em `src/App.jsx`. Textos PT/EN embutidos no próprio componente (`const TEXT = {...}`) em vez de usar `src/i18n/messages.js` — foi criada numa branch separada da branch que introduziu esse dicionário, mantidas independentes de propósito. Se um dia mexer nos textos daqui, considere migrar pro dicionário central pra manter um padrão só.
