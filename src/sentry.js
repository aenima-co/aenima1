import * as Sentry from "@sentry/react";

// Sem DSN (dev local, por exemplo, sem VITE_SENTRY_DSN configurado), o
// Sentry.init nunca roda e todo o resto do SDK (Sentry.captureException
// usado nos catch espalhados pelo app) vira um no-op seguro — não precisa
// checar "se está configurado" em cada lugar que usa.
const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({ dsn });
}

export { Sentry };
