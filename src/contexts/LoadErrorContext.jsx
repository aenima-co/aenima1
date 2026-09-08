import { createContext, useContext, useCallback, useRef, useState } from 'react';

// Reúne as falhas de carregamento de qualquer seção da página num único
// lugar, pra mostrar UM aviso só (com um botão de tentar novamente que
// recarrega tudo que falhou) em vez de repetir a mesma mensagem em cada
// seção que não conseguiu buscar dados do Strapi.
const LoadErrorContext = createContext(null);

export function LoadErrorProvider({ children }) {
  const [errorIds, setErrorIds] = useState(() => new Set());
  const retryFns = useRef(new Map());

  const reportError = useCallback((id, retryFn) => {
    retryFns.current.set(id, retryFn);
    setErrorIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  const clearError = useCallback((id) => {
    retryFns.current.delete(id);
    setErrorIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const retryAll = useCallback(() => {
    retryFns.current.forEach((fn) => fn());
  }, []);

  return (
    <LoadErrorContext.Provider
      value={{ hasErrors: errorIds.size > 0, reportError, clearError, retryAll }}
    >
      {children}
    </LoadErrorContext.Provider>
  );
}

export function useLoadError() {
  const ctx = useContext(LoadErrorContext);
  if (!ctx) throw new Error('useLoadError precisa estar dentro de um LoadErrorProvider');
  return ctx;
}
