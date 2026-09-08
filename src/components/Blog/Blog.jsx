import { useEffect, useState } from 'react';
import { getPosts } from '../../api';
import './Blog.css';
import { resolveMediaUrl } from '../../config';
import LoadError from '../LoadError/LoadError';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);

  function load() {
    getPosts(true)
      .then((data) => {
        setPosts(data);
        setError(false);
      })
      .catch((err) => {
        console.error('[Blog] erro ao carregar:', err);
        setError(true);
      });
  }

  useEffect(load, []);

  if (error) return <LoadError onRetry={load} />;
  if (!posts.length) return null;

  const getImagem = (post) => {
    return resolveMediaUrl(post.imagem?.[0]?.url);
  };

  return (
  <section className="blog">
    <span className="blog__tag">// BLOG</span>
    <div className="blog__grid-wrap">
      <div className="blog__grid">
        {posts.map((post) => (
          <a
            key={post.id}
            href={`/blog/${post.slug}`}
            className="blog__card"
          >
            <div className={`blog__imagem-wrap blog__imagem-wrap--${post.slug}`}>
              {getImagem(post) && (
                <img
                  src={getImagem(post)}
                  alt={post.titulo}
                  className="blog__imagem"
                />
              )}
            </div>
            <div className="blog__info">
              <h3 className="blog__titulo">{post.titulo}</h3>
              <p className="blog__subtitulo">{post.subtitulo}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  </section>
);
}