import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// O navegador não reseta a rolagem sozinho ao trocar de rota numa SPA — se
// o visitante estava com scroll lá embaixo na página anterior, a página
// nova abre nessa mesma posição (às vezes já caindo no rodapé). Isso rola
// pro topo toda vez que a rota muda, como uma navegação normal de site.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
