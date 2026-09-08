import { useLang } from '../../contexts/LanguageContext';
import { t } from '../../i18n/messages';
import Button from '../Button/Button';
import './LoadError.css';

function AlertIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5.5V11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="14.25" r="1" fill="currentColor" />
    </svg>
  );
}

export default function LoadError({ onRetry }) {
  const { lang } = useLang();
  return (
    <div className="load-error">
      <span className="load-error__icon">
        <AlertIcon />
      </span>
      <p className="load-error__text">{t(lang, 'common.loadError')}</p>
      {onRetry && (
        <Button className="load-error__retry" onClick={onRetry}>
          {t(lang, 'common.retry')}
        </Button>
      )}
    </div>
  );
}
