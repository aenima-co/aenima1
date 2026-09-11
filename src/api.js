import { STRAPI_URL } from "./config";

const API_URL = `${STRAPI_URL}/api`;

// Cache simples por URL, só pra dentro da sessão (some ao recarregar a
// página). Existe pra dois casos reais: (1) componentes independentes que
// acabam pedindo exatamente o mesmo endpoint ao montar juntos (ex: Hero,
// BestWork e SecaoAbout todos leem /api/home) — sem isso, viram N
// requisições de rede idênticas em vez de 1; (2) voltar a uma rota já
// visitada na mesma sessão fica instantâneo em vez de refazer o fetch.
// `res.clone()` permite cada chamador ler o body (.json()) independentemente
// sem consumir a Response compartilhada.
const requestCache = new Map();

function cachedFetch(url) {
  if (!requestCache.has(url)) {
    const promise = fetch(url).catch((err) => {
      requestCache.delete(url);
      throw err;
    });
    requestCache.set(url, promise);
  }
  return requestCache.get(url).then((res) => res.clone());
}

// Tenta com locale; se o content type não tiver i18n habilitado no Strapi (404/400), retorna sem locale
async function withLocaleFallback(urlWithLocale, urlWithoutLocale) {
  let res = await cachedFetch(urlWithLocale);
  if (res.status === 404 || res.status === 400) {
    res = await cachedFetch(urlWithoutLocale);
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
  // `[fields][0]=url` em cada relação de mídia evita trazer os variantes de
  // imagem (large/medium/small/thumbnail) e metadados que o front nunca lê —
  // só a url é usada. Reduz o payload em ~50-90% dependendo do endpoint,
  // verificado comparando o tamanho real da resposta antes/depois.
  const POPULATE =
    `populate[logo][fields][0]=url` +
    `&populate[contact_us][populate]=*`;
  return withLocaleFallback(
    `${API_URL}/navebar?${POPULATE}&locale=${locale}`,
    `${API_URL}/navebar?${POPULATE}`,
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
  const res = await cachedFetch(`${API_URL}/projetos${filtro}`);
  const data = await res.json();
  return data.data;
}

export async function getPosts(apenasDestaque = false) {
  const filtro = apenasDestaque
    ? "?filters[destaque]=true&sort=ordem&populate[imagem][fields][0]=url"
    : "?sort=ordem&populate[imagem][fields][0]=url";
  const res = await cachedFetch(`${API_URL}/posts${filtro}`);
  const data = await res.json();
  return data.data;
}

export async function getEspecialistas() {
  const res = await cachedFetch(`${API_URL}/especialistas`);
  const data = await res.json();
  return data.data;
}

export async function getEspecialidades() {
  const res = await cachedFetch(`${API_URL}/especialidades?sort=ordem`);
  const data = await res.json();
  return data.data;
}

export async function getHome(locale = "pt-BR") {
  const POPULATE =
    `populate[hero][populate][imagem_fundo][fields][0]=url` +
    `&populate[hero][populate][imagem_fundo_mobile][fields][0]=url` +
    `&populate[hero][populate][botao_principal][populate]=*` +
    `&populate[hero][populate][memberCard][populate][members_image][fields][0]=url` +
    `&populate[botao_projeto][populate]=*` +
    `&populate[secao_about_preview][populate][icone][fields][0]=url`;
  return withLocaleFallback(
    `${API_URL}/home?locale=${locale}&${POPULATE}`,
    `${API_URL}/home?${POPULATE}`,
  );
}

export async function getDemoReel(locale = "pt-BR") {
  const POPULATE =
    `populate[demo_titulo][populate]=*` +
    `&populate[stickers][fields][0]=url`;
  return withLocaleFallback(
    `${API_URL}/demo-reel?locale=${locale}&${POPULATE}`,
    `${API_URL}/demo-reel?${POPULATE}`,
  );
}

export async function getFooter(locale = "pt-BR") {
  const POPULATE =
    `populate[background][fields][0]=url` +
    `&populate[backmobile][fields][0]=url` +
    `&populate[arrow_icon][fields][0]=url` +
    `&populate[logo][fields][0]=url` +
    `&populate[redes_sociais][populate]=*` +
    `&populate[memberCard][populate][members_image][fields][0]=url`;
  return withLocaleFallback(
    `${API_URL}/footer?locale=${locale}&${POPULATE}`,
    `${API_URL}/footer?${POPULATE}`,
  );
}

export async function getValues() {
  const res = await cachedFetch(`${API_URL}/values?sort=order&populate=*`);
  if (!res.ok) {
    console.error("[getValues] erro HTTP:", res.status);
    return null;
  }
  const data = await res.json();
  return data.data;
}

export async function getTeamMembers() {
  const res = await cachedFetch(`${API_URL}/team-members?sort=order&populate=*`);
  if (!res.ok) {
    console.error("[getTeamMembers] erro HTTP:", res.status);
    return null;
  }
  const data = await res.json();
  return data.data;
}

export async function getWorkPage(locale = "pt-BR") {
  return withLocaleFallback(
    `${API_URL}/work-page?locale=${locale}`,
    `${API_URL}/work-page`,
  );
}

export async function getBestWorks() {
  const res = await cachedFetch(
    `${API_URL}/works?filters[bestWork][$eq]=true&populate[cover][fields][0]=url&sort=createdAt:desc`,
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

export async function getWorks() {
  const res = await cachedFetch(
    `${API_URL}/works?populate[cover][fields][0]=url&sort=createdAt:desc`,
  );

  if (!res.ok) {
    console.error("[getWorks] erro HTTP:", res.status);
    return [];
  }

  const data = await res.json();
  return data.data;
}

const WORK_DETAIL_POPULATE =
  `populate[cover][fields][0]=url` +
  `&populate[info][populate]=*` +
  `&populate[secoes][populate]=*`;

export async function getWorkBySlug(slugOrId) {
  // Try by slug first
  const bySlug = await cachedFetch(
    `${API_URL}/works?filters[slug][$eq]=${encodeURIComponent(
      slugOrId,
    )}&${WORK_DETAIL_POPULATE}`,
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
    const byId = await cachedFetch(
      `${API_URL}/works?filters[id][$eq]=${encodeURIComponent(
        slugOrId,
      )}&${WORK_DETAIL_POPULATE}`,
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
    `&populate[social_mobile][populate][icon][fields][0]=url` +
    `&populate[social_desktop][populate][icon][fields][0]=url`;
  return withLocaleFallback(
    `${API_URL}/contact?locale=${locale}&${POPULATE}`,
    `${API_URL}/contact?${POPULATE}`,
  );
}

export async function getBlogPage() {
  const res = await cachedFetch(`${API_URL}/blog-page?populate=*`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.data ?? null;
}

export async function postContactSubmission({ name, email, description }) {
  const res = await fetch(`${API_URL}/contact-submissions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { name, email, description } }),
  });
  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    const err = new Error(payload?.error?.message || `Falha ao enviar contato (HTTP ${res.status})`);
    err.status = res.status;
    err.fieldErrors = payload?.error?.details?.errors ?? [];
    throw err;
  }

  return payload?.data;
}

export async function getAboutPage(locale = "pt-BR") {
  const POPULATE =
    `?populate[about_description][populate][icon][fields][0]=url` +
    `&populate[members_detail][populate][member_pic][fields][0]=url` +
    `&populate[right_cards][fields][0]=url`;
  return withLocaleFallback(
    `${API_URL}/about-page${POPULATE}&locale=${locale}`,
    `${API_URL}/about-page${POPULATE}`,
  );
}
