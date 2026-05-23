import { useEffect, useState } from 'react';
import { getHome } from '../../api';
import Button from '../Button/Button';
import './Hero.css';

const STRAPI_URL = 'http://localhost:1337';

export default function Hero() {
  const [hero, setHero] = useState(null);

  useEffect(() => {
    getHome().then((data) => setHero(data.hero));
  }, []);

  if (!hero) return null;

  const imagemFundo = hero.imagem_fundo?.[0]?.url
    ? `${STRAPI_URL}${hero.imagem_fundo[0].url}`
    : null;

  return (
    <section
      className="hero"
      style={imagemFundo ? {
        backgroundImage: `url(${imagemFundo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : {}}
    >
      <div className="hero__content">
        <p className="hero__subtitulo">{hero.subtitulo}</p>
      </div>
      <h1 className="hero__titulo">
        <span className="hero__titulo-linha1">{hero.titulo_linha1}</span>
        <span className="hero__titulo-linha2">{hero.titulo_linha2}</span>
      </h1>
      <div className="hero__actions">
        <p className="hero__especialistas">{hero.texto_especialistas}</p>
        <Button>{hero.botao_principal?.texto || 'Start a project'}</Button>
      </div>
    </section>
  );
}