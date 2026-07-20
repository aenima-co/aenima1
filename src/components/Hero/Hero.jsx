import { useEffect, useState } from "react";
import { getHome } from "../../api";
import { useLang } from "../../contexts/LanguageContext";
import Button from "../Button/Button";
import "./Hero.css";

const STRAPI_URL = "http://localhost:1337";

// Campos esperados em cada item de members_image no Strapi:
//   foto     → Media (imagem do membro)
//   nome     → Short text
//   funcao   → Short text (cargo/role)
//   linkedin → Text (URL do perfil)

function LinkedInIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Hero() {
  const { locale } = useLang();
  const [hero, setHero] = useState(null);

  useEffect(() => {
    getHome(locale).then((data) => data && setHero(data.hero));
  }, [locale]);

  if (!hero) return null;

  // Suporta tanto media múltipla (array) quanto single
  const resolveMedia = (field) => {
    if (!field) return null;
    if (Array.isArray(field))
      return field[0]?.url ? `${STRAPI_URL}${field[0].url}` : null;
    if (field.url) return `${STRAPI_URL}${field.url}`;
    return null;
  };

  const imagemFundo = resolveMedia(hero.imagem_fundo);
  const imagemFundoMobile = resolveMedia(hero.imagem_fundo_mobile);
  const members = hero.memberCard || [];

  const bgStyle = {
    ...(imagemFundo && { "--bg-desktop": `url(${imagemFundo})` }),
    ...(imagemFundoMobile && { "--bg-mobile": `url(${imagemFundoMobile})` }),
  };

  return (
    <section className="hero">
      <div className="hero__bg" style={bgStyle}>
        <div className="hero__top">
          {members.length > 0 && (
            <div className="hero__members">
              {members.map((member) => {
                const fotoUrl = resolveMedia(member.members_image);
                return (
                  <div key={member.id} className="hero__member">
                    {fotoUrl && (
                      <img
                        src={fotoUrl}
                        alt={member.nome || ""}
                        className="hero__member-avatar"
                      />
                    )}
                    <div className="hero__member-tooltip" role="tooltip">
                      <div className="hero__member-tooltip-header">
                        <span className="hero__member-name">{member.nome}</span>
                        <a
                          href={member.linkedin || "#"}
                          target={member.linkedin ? "_blank" : undefined}
                          rel="noreferrer"
                          className="hero__member-linkedin"
                          aria-label={`LinkedIn de ${member.nome}`}
                        >
                          <LinkedInIcon />
                        </a>
                      </div>
                      <span className="hero__member-role">{member.funcao}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {hero.texto_especialistas && (
            <p className="hero__especialistas">{hero.texto_especialistas}</p>
          )}
        </div>

        <div className="hero__bottom">
          <div className="hero__content">
            <p className="hero__subtitulo">{hero.subtitulo}</p>
            <h1 className="hero__titulo">
              <span className="hero__titulo-linha1">{hero.titulo_linha1}</span>
              <span className="hero__titulo-linha2">{hero.titulo_linha2}</span>
            </h1>
          </div>

          <div className="hero__actions">
            <Button variant="light">
              {hero.botao_principal?.texto || "Start a project"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
