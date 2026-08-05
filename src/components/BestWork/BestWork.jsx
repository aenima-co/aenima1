import { useEffect, useState } from 'react';
import { getBestWorks, getHome } from '../../api';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LanguageContext';
import Button from '../Button/Button';
import './BestWork.css';

const STRAPI_URL = 'http://localhost:1337';

export default function BestWork() {
  const { locale } = useLang();
  const [works, setWorks] = useState([]);
  const [botao, setBotao] = useState(null);

  useEffect(() => {
    getBestWorks().then(setWorks);
    getHome(locale).then((data) => setBotao(data?.botao_projeto));
  }, [locale]);

  if (!works.length) return null;

  const [principal, ...secundarios] = works;

  const getCover = (work) => {
    const cover = work.cover;
    if (!cover) return null;
    if (Array.isArray(cover)) return cover[0]?.url ? `${STRAPI_URL}${cover[0].url}` : null;
    return cover.url ? `${STRAPI_URL}${cover.url}` : null;
  };

  return (
    <section className="best-work">
      <span className="best-work__tag">// BEST WORK</span>

      <div className="best-work__grid">

        {/* Card principal — grande */}
        <Link to={`/work/${principal.slug}`} className="best-work__card best-work__card--principal">
          <div className="best-work__imagem-wrap">
            {getCover(principal) && (
              <img
                src={getCover(principal)}
                alt={principal.title}
                className="best-work__imagem"
              />
            )}
          </div>
          {/* info visível só no mobile */}
          <div className="best-work__info best-work__info--mobile">
            <h3 className="best-work__titulo">{principal.title}</h3>
            <p className="best-work__subtitulo">{principal.client}</p>
          </div>
        </Link>

        {/* Cards secundários */}
        <div className="best-work__secundarios">
          {secundarios.map((work) => (
            <Link
              key={work.id}
              to={`/work/${work.slug}`}
              className="best-work__card best-work__card--secundario"
            >
              <div className="best-work__imagem-wrap">
                {getCover(work) && (
                  <img
                    src={getCover(work)}
                    alt={work.title}
                    className="best-work__imagem"
                  />
                )}
              </div>
              <div className="best-work__info">
                <h3 className="best-work__titulo">{work.title}</h3>
                <p className="best-work__subtitulo">{work.client}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>

      {/* Rodapé — título + botão na mesma linha (só desktop) */}
      <div className="best-work__rodape">
        <div>
          <h3 className="best-work__titulo">{principal.title}</h3>
          <p className="best-work__subtitulo">{principal.client}</p>
        </div>
        {botao && (
          <div className="best-work__botao-link">
            <Button variant="light" href={botao.link}>{botao.texto}</Button>
          </div>
        )}
      </div>

    </section>
  );
}