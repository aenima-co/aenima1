# Pontos de atenção conhecidos

Coisas que não são bugs pra corrigir agora, mas ficam registradas pra não serem esquecidas.

## Textos de sistema (erros, estados vazios) traduzidos no código, não no Strapi

Decisão consciente (2026-08-25): mensagens de validação de formulário, estados de carregamento/vazio e alguns `aria-label` ficam num dicionário no próprio código do frontend, em [`src/i18n/messages.js`](src/i18n/messages.js), em vez de virarem campo no Strapi como o resto do conteúdo do site.

**Por quê**: são textos de sistema (erro de validação, "carregando", "não encontrado"), não conteúdo editorial — não faz sentido alguém sem acesso a código precisar editar isso com frequência, e manter fora do Strapi evita criar campos extras só pra esse tipo de mensagem.

**Onde mexer**: abra `src/i18n/messages.js`. Tem duas seções, `pt` e `en`, cada uma com as mesmas chaves — pra editar um texto existente, ache a chave (ex: `contactForm.nameRequired`) e troque o valor nos dois idiomas. Pra adicionar um texto novo, crie a chave nova nos dois idiomas e use a função `t(lang, "grupo.chave")` no componente (o `lang` vem de `useLang()`, do `LanguageContext`).

**Onde isso é usado hoje**: formulário de contato inteiro (`ContactPage.jsx` — validações, "Enviando...", banners de sucesso/erro), estados de carregamento (`AboutPage.jsx`, `WorkPage.jsx`, `PortfolioPage.jsx`), estados vazios/não encontrado (`WorkPage.jsx`, `PortfolioPage.jsx`), e os `aria-label` do menu hambúrguer (`Header.jsx`), do seletor de idioma (`LanguageToggle.jsx`) e do play do vídeo (`DemoReel.jsx`).

## Campo `email` do rodapé vazio na versão em português

Achado numa varredura de idiomas (2026-08-25): o content-type `Footer` no Strapi tem o campo `email` preenchido só na localização `en` — a versão `pt-BR` está vazia. Como `Footer.jsx` só renderiza a linha do e-mail se `footer.email` existir, essa linha inteira some do rodapé quando o site está em português. Não é bug de código — precisa preencher o campo no admin do Strapi (Content Manager → Footer → trocar pra locale pt-BR → campo `email`).

## Blog sem conteúdo real (seção escondida de propósito)

A seção "// BLOG" da Home (`src/components/Blog/Blog.jsx`) está com `display: none` em [`Blog.css:5`](src/components/Blog/Blog.css#L5), sem nenhuma media query que reative isso em nenhuma largura de tela — fica sempre escondida, em qualquer dispositivo. Isso é intencional: ainda não há posts reais pra mostrar, só um post de exemplo/placeholder ("The Birth of Venus") cadastrado no Strapi.

**O que falta, pra quando houver conteúdo real:**

1. **Remover o `display: none`** de `.blog` em `Blog.css`.
2. **Criar a página de detalhe do post**, seguindo o mesmo padrão já usado pro Work:
   - Rota `/blog/:slug` em `src/App.jsx` (hoje só existe `/blog`, a listagem — não existe rota de detalhe, nem componente de página, nem função na API pra buscar um post específico).
   - Componente de página nos moldes de `src/pages/PortfolioPage/PortfolioPage.jsx` (que já faz esse papel para `/work/:slug`).
   - Função `getPostBySlug()` (ou similar) em `src/api.js`, análoga à `getWorkBySlug()` já existente.
3. Os cards de post na Home (`Blog.jsx`) e na listagem (`src/pages/BlogPage/BlogPage.jsx`) linkam pra `/blog/:slug` — hoje esse link não navega pra lugar nenhum útil (rota inexistente), mas como a seção está escondida, ninguém consegue clicar nele por enquanto.
