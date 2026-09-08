import { useEffect, useState } from 'react';
import { getBestWorks, getHome } from '../../api';
import { Link } from 'react-router-dom';
import { useLang } from '../../contexts/LanguageContext';
import Button from '../Button/Button';
import './BestWork.css';
import { resolveMediaUrl } from '../../config';
import LoadError from '../LoadError/LoadError';

export default function BestWork() {
  const { locale } = useLang();
  const [works, setWorks] = useState([]);
  const [botao, setBotao] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getBestWorks()
      .then(setWorks)
      .catch((err) => {
        console.error('[BestWork] erro ao carregar:', err);
        setError(true);
      });
    getHome(locale).then((data) => setBotao(data?.botao_projeto)).catch(() => {});
  }, [locale]);

  if (error) return <LoadError />;
  if (!works.length) return null;

  const [principal, ...secundarios] = works;

  const getCover = (work) => {
    const cover = work.cover;
    if (!cover) return null;
    if (Array.isArray(cover)) return resolveMediaUrl(cover[0]?.url);
    return resolveMediaUrl(cover.url);
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