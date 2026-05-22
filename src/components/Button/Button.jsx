import './Button.css';

function ArrowIcon({ className }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 11L11 1M11 10V1H2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Button({ children, className = '', ...props }) {
  return (
    <button className={`cta-btn ${className}`} {...props}>
      <span className="cta-btn__text">{children}</span>
      <span className="cta-btn__circle">
        <ArrowIcon className="cta-btn__arrow" />
      </span>
    </button>
  );
}
