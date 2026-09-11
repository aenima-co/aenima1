import { useCallback, useEffect, useRef, useState } from 'react';
import { getPosts } from '../../api';
import './Blog.css';
import { resolveMediaUrl } from '../../config';
import { useLoadError } from '../../contexts/LoadErrorContext';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const { reportError, clearError } = useLoadError();
  const loadRef = useRef(() => {});

  const load = useCallback(() => {
    getPosts(true)
      .then((data) => {
        setPosts(data);
        clearError('blog');
      })
      .catch((err) => {
        console.error('[Blog] erro ao carregar:', err);
        reportError('blog', () => loadRef.current());
      });
  }, [reportError, clearError]);

  useEffect(() => {
    loadRef.current = load;
    load();
  }, [load]);

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