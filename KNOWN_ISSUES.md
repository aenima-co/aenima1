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

## Título da aba (`<title>`) e favicon

Antes disso (2026-08-25) o site inteiro usava o `<title>` padrão do Vite ("React") e não tinha favicon nenhum. Corrigido assim:

- **Favicon**: [`public/favicon.svg`](public/favicon.svg) — só o símbolo roxo (o "moinho" `#7F6CFF`) extraído do `src/assets/img/logo.svg` existente, sem o texto "aenima" (título de aba fica ilegível com texto muito pequeno). Vinculado em `index.html` via `<link rel="icon">`. Pra trocar o ícone: gerar/editar o SVG e substituir o arquivo, mantendo o nome (não precisa mexer no `index.html`).
- **Título por página**: dicionário no código (mesma decisão de manter textos de sistema fora do Strapi, ver seção acima) — em [`src/hooks/usePageTitle.js`](src/hooks/usePageTitle.js), objeto `TITLES` com uma chave por rota, nos dois idiomas. Cada página chama `usePageTitle("chave", lang)` (ex: `usePageTitle("about", lang)` em `AboutPage.jsx`). Pra editar um título existente, mude o valor no dicionário; pra uma página nova, adicione a chave nos dois idiomas e chame o hook no componente da página.
- **Caso especial — página de projeto** (`PortfolioPage.jsx`): usa o terceiro parâmetro do hook (`usePageTitle("work", lang, work?.title)`) pra mostrar o nome do projeto na aba (ex: "Tese Pedagógica — aenima") em vez do título genérico "Portfólio".
