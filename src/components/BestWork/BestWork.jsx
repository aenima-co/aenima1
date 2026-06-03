import { useEffect, useState } from 'react';
import { getProjetos, getHome } from '../../api';
import Button from '../Button/Button';
import './BestWork.css';

const STRAPI_URL = 'http://localhost:1337';

export default function BestWork() {
  const [projetos, setProjetos] = useState([]);
  const [botao, setBotao] = useState(null);

  useEffect(() => {
    getProjetos(true).then(setProjetos);
    getHome().then((data) => setBotao(data?.botao_projeto));
  }, []);

  if (!projetos.length) return null;

  const [principal, ...secundarios] = projetos;

  const getImagem = (projeto) => {
    const url = projeto.imagem?.[0]?.url;
    return url ? `${STRAPI_URL}${url}` : null;
  };

  return (
    <section className="best-work">
      <span className="best-work__tag">// BEST WORK</span>

      <div className="best-work__grid">

        {/* Card principal — grande */}
        <a href={`/work/${principal.slug}`} className="best-work__card best-work__card--principal">
          <div className="best-work__imagem-wrap">
            {getImagem(principal) && (
              <img
                src={getImagem(principal)}
                alt={principal.titulo}
                className="best-work__imagem"
              />
            )}
          </div>
          {/* info visível só no mobile */}
          <div className="best-work__info best-work__info--mobile">
            <h3 className="best-work__titulo">{principal.titulo}</h3>
            <p className="best-work__subtitulo">{principal.subtitulo}</p>
          </div>
        </a>

        {/* Cards secundários */}
        <div className="best-work__secundarios">
          {secundarios.map((projeto) => (
            <a
              key={projeto.id}
              href={`/work/${projeto.slug}`}
              className="best-work__card best-work__card--secundario"
            >
              <div className="best-work__imagem-wrap">
                {getImagem(projeto) && (
                  <img
                    src={getImagem(projeto)}
                    alt={projeto.titulo}
                    className="best-work__imagem"
                  />
                )}
              </div>
              <div className="best-work__info">
                <h3 className="best-work__titulo">{projeto.titulo}</h3>
                <p className="best-work__subtitulo">{projeto.subtitulo}</p>
              </div>
            </a>
          ))}
        </div>

      </div>

      {/* Rodapé — título + botão na mesma linha (só desktop) */}
      <div className="best-work__rodape">
        <div>
          <h3 className="best-work__titulo">{principal.titulo}</h3>
          <p className="best-work__subtitulo">{principal.subtitulo}</p>
        </div>
        {botao && (
          <a href={botao.link} className="best-work__botao-link">
            <Button>{botao.texto}</Button>
          </a>
        )}
      </div>

    </section>
  );
}