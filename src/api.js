const API_URL = "http://localhost:1337/api";

// Tenta com locale; se o content type não tiver i18n habilitado no Strapi (404/400), retorna sem locale
async function withLocaleFallback(urlWithLocale, urlWithoutLocale) {
  let res = await fetch(urlWithLocale);
  if (res.status === 404 || res.status === 400) {
    res = await fetch(urlWithoutLocale);
  }
  if (!res.ok) return null;
  const json = await res.json();
  return json.data ?? null;
}

export async function getBannerTopo(locale = "pt-BR") {
  return withLocaleFallback(
    `${API_URL}/bannertopo?locale=${locale}`,
    `${API_URL}/bannertopo`,
  );
}

export async function getNavbar(locale = "pt-BR") {
  return withLocaleFallback(
    `${API_URL}/navebar?populate=*&locale=${locale}`,
    `${API_URL}/navebar?populate=*`,
  );
}

export async function getMenuItens(locale = "pt-BR") {
  return withLocaleFallback(
    `${API_URL}/menu-items?sort=ordem&locale=${locale}`,
    `${API_URL}/menu-items?sort=ordem`,
  );
}

export async function getProjetos(apenasDestaque = false) {
  const filtro = apenasDestaque
    ? "?filters[destaque]=true&sort=ordem&populate=*"
    : "?sort=ordem&populate=*";
  const res = await fetch(`${API_URL}/projetos${filtro}`);
  const data = await res.json();
  return data.data;
}

export async function getPosts(apenasDestaque = false) {
  const filtro = apenasDestaque
    ? "?filters[destaque]=true&sort=ordem&populate=*"
    : "?sort=ordem&populate=*";
  const res = await fetch(`${API_URL}/posts${filtro}`);
  const data = await res.json();
  return data.data;
}

export async function getEspecialistas() {
  const res = await fetch(`${API_URL}/especialistas`);
  const data = await res.json();
  return data.data;
}

export async function getEspecialidades() {
  const res = await fetch(`${API_URL}/especialidades?sort=ordem`);
  const data = await res.json();
  return data.data;
}

export async function getHome(locale = "pt-BR") {
  const POPULATE =
    `populate[0]=hero.imagem_fundo` +
    `&populate[1]=hero.imagem_fundo_mobile` +
    `&populate[2]=hero.botao_principal` +
    `&populate[3]=hero.memberCard` +
    `&populate[4]=hero.memberCard.members_image` +
    `&populate[5]=botao_projeto` +
    `&populate[6]=secao_about_preview` +
    `&populate[7]=secao_about_preview.icone`;
  return withLocaleFallback(
    `${API_URL}/home?locale=${locale}&${POPULATE}`,
    `${API_URL}/home?${POPULATE}`,
  );
}

export async function getDemoReel(locale = "pt-BR") {
  return withLocaleFallback(
    `${API_URL}/demo-reel?locale=${locale}&populate[0]=demo_titulo&populate[1]=stickers`,
    `${API_URL}/demo-reel?populate[0]=demo_titulo&populate[1]=stickers`,
  );
}

export async function getFooter(locale = "pt-BR") {
  return withLocaleFallback(
    `${API_URL}/footer?locale=${locale}&populate[0]=background&populate[1]=backmobile&populate[2]=arrow_icon&populate[3]=logo&populate[4]=redes_sociais&populate[5]=memberCard&populate[6]=memberCard.members_image`,
    `${API_URL}/footer?populate[0]=background&populate[1]=backmobile&populate[2]=arrow_icon&populate[3]=logo&populate[4]=redes_sociais&populate[5]=memberCard&populate[6]=memberCard.members_image`,
  );
}

export async function getValues() {
  const res = await fetch(`${API_URL}/values?sort=order&populate=*`);
  if (!res.ok) {
    console.error("[getValues] erro HTTP:", res.status);
    return null;
  }
  const data = await res.json();
  return data.data;
}

export async function getTeamMembers() {
  const res = await fetch(`${API_URL}/team-members?sort=order&populate=*`);
  if (!res.ok) {
    console.error("[getTeamMembers] erro HTTP:", res.status);
    return null;
  }
  const data = await res.json();
  return data.data;
}

export async function getWorkPage() {
  const res = await fetch(`${API_URL}/work-page`);

  if (!res.ok) {
    console.error("[getWorkPage] erro HTTP:", res.status);
    return null;
  }

  const data = await res.json();
  return data.data;
}

export async function getWorks() {
  const res = await fetch(
    `${API_URL}/works?populate=cover&sort=createdAt:desc`,
  );

  if (!res.ok) {
    console.error("[getWorks] erro HTTP:", res.status);
    return [];
  }

  const data = await res.json();
  return data.data;
}

export async function getWorkBySlug(slugOrId) {
  // Try by slug first
  const bySlug = await fetch(
    `${API_URL}/works?filters[slug][$eq]=${encodeURIComponent(
      slugOrId,
    )}&populate=*`,
  );

  if (bySlug.ok) {
    const data = await bySlug.json();

    if (data.data?.length) {
      return data.data[0];
    }
  }

  // Fallback to numeric id. Strapi v5's single-item route (/works/:id)
  // expects documentId, not the numeric id, so filter the collection
  // instead of hitting that route directly.
  if (!isNaN(slugOrId)) {
    const byId = await fetch(
      `${API_URL}/works?filters[id][$eq]=${encodeURIComponent(
        slugOrId,
      )}&populate=*`,
    );

    if (byId.ok) {
      const data = await byId.json();

      if (data.data?.length) {
        return data.data[0];
      }
    }
  }

  return null;
}

export async function getContact(locale = "pt-BR") {
  const POPULATE =
    `populate[form][populate]=*` +
    `&populate[social_mobile][populate][icon][populate]=*` +
    `&populate[social_desktop][populate][icon][populate]=*`;
  return withLocaleFallback(
    `${API_URL}/contact?locale=${locale}&${POPULATE}`,
    `${API_URL}/contact?${POPULATE}`,
  );
}

export async function getAboutPage() {
  const res = await fetch(
    `${API_URL}/about-page` +
      `?populate[0]=about_description` +
      `&populate[1]=about_description.icon` +
      `&populate[2]=members_detail` +
      `&populate[3]=members_detail.member_pic`,
  );

  if (!res.ok) {
    console.error("[getAboutPage] erro HTTP:", res.status);
    return null;
  }

  const data = await res.json();
  return data.data;
}
