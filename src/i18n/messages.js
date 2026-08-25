// Textos fixos da interface que não vêm do Strapi (mensagens de erro,
// estados vazios, aria-labels). Decisão consciente: ficam aqui em vez de
// virar campo no Strapi porque são textos de sistema/validação, não
// conteúdo editorial. Pra adicionar um texto novo: adicione a chave nos
// dois idiomas (pt e en) abaixo, depois use t(lang, "grupo.chave") no
// componente. Pra editar um texto existente, edite direto aqui.
const messages = {
  pt: {
    common: {
      loading: "Carregando…",
    },
    contactForm: {
      nameRequired: "Informe seu nome.",
      emailInvalid: "Informe um e-mail válido.",
      descriptionRequired: "Conte um pouco mais do que você busca.",
      invalidField: "Campo inválido.",
      sending: "Enviando...",
      successBanner: "Mensagem enviada com sucesso! Retornaremos em breve.",
      clientErrorBanner: "Verifique os campos destacados e tente novamente.",
      serverErrorBanner: "Não foi possível enviar sua mensagem. Tente novamente em instantes.",
      genericSendError: (status) => `Falha ao enviar contato (HTTP ${status})`,
    },
    header: {
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    languageToggle: {
      switchLanguage: "Trocar idioma",
    },
    demoReel: {
      playVideo: "Reproduzir vídeo",
    },
    workPage: {
      empty: "Nenhum projeto cadastrado ainda.",
    },
    portfolioPage: {
      notFound: "Projeto não encontrado.",
    },
  },
  en: {
    common: {
      loading: "Loading…",
    },
    contactForm: {
      nameRequired: "Please enter your name.",
      emailInvalid: "Please enter a valid email.",
      descriptionRequired: "Tell us a bit more about what you're looking for.",
      invalidField: "Invalid field.",
      sending: "Sending...",
      successBanner: "Message sent successfully! We'll get back to you soon.",
      clientErrorBanner: "Check the highlighted fields and try again.",
      serverErrorBanner: "We couldn't send your message. Please try again shortly.",
      genericSendError: (status) => `Failed to send contact (HTTP ${status})`,
    },
    header: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    languageToggle: {
      switchLanguage: "Switch language",
    },
    demoReel: {
      playVideo: "Play video",
    },
    workPage: {
      empty: "No projects yet.",
    },
    portfolioPage: {
      notFound: "Project not found.",
    },
  },
};

export function t(lang, path) {
  const dict = messages[lang] || messages.pt;
  return path.split(".").reduce((acc, key) => acc?.[key], dict);
}

export default messages;
