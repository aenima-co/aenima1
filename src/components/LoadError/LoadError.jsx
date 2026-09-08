import { useLang } from '../../contexts/LanguageContext';
import { t } from '../../i18n/messages';
import './LoadError.css';

export default function LoadError() {
  const { lang } = useLang();
  return <p className="load-error">{t(lang, 'common.loadError')}</p>;
}
