import { useLang } from '../../contexts/LanguageContext';
import { useLoadError } from '../../contexts/LoadErrorContext';
import { t } from '../../i18n/messages';
import Button from '../Button/Button';
import './LoadErrorBanner.css';

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5.5V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.25" r="1" fill="currentColor" />
    </svg>
  );
}

export default function LoadErrorBanner() {
  const { lang } = useLang();
  const { hasErrors, retryAll } = useLoadError();

  if (!hasErrors) return null;

  return (
    <div className="load-error-banner" role="status">
      <span className="load-error-banner__icon">
        <AlertIcon />
      </span>
      <p className="load-error-banner__text">{t(lang, 'common.loadError')}</p>
      <Button className="load-error-banner__retry" onClick={retryAll}>
        {t(lang, 'common.retry')}
      </Button>
    </div>
  );
}
