export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

// Mídia enviada antes de 2026-08-24 fica no disco do Strapi e tem URL
// relativa ("/uploads/x.png"), que precisa do STRAPI_URL na frente. Mídia
// enviada depois vai pro Supabase Storage e já vem com URL absoluta
// ("https://...supabase.co/..."), que quebra se prefixada de novo.
export function resolveMediaUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${STRAPI_URL}${url}`;
}
