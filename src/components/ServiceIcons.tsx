/**
 * Line icons for the service categories.
 *
 * Drawn as inline SVG rather than emoji: emoji render differently on every
 * platform and cannot take the brand colour, which made the old trust strip
 * look inconsistent between Windows and iOS.
 */
type IconProps = { className?: string };

const base = "h-6 w-6";

export function MotIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3 4 6v5.5c0 4.4 3.2 8.3 8 9.5 4.8-1.2 8-5.1 8-9.5V6l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function SpannerIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.7 6.3a4 4 0 0 0 5.1 5.1l-8.4 8.4a2.5 2.5 0 0 1-3.6-3.6l6.9-9.9Z" />
      <path d="M14.7 6.3 17 4a4 4 0 0 0-5.2 5.2" />
    </svg>
  );
}

export function TyreIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3v5.6M12 15.4V21M3 12h5.6M15.4 12H21" />
    </svg>
  );
}

export function BrakeIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v3M20.5 12h-3M12 20.5v-3M3.5 12h3M17.9 6.1l-2.1 2.1M17.9 17.9l-2.1-2.1M6.1 17.9l2.1-2.1M6.1 6.1l2.1 2.1" />
    </svg>
  );
}

export function DiagnosticsIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12h3.5l2-5 3 10 2.5-6 1.5 3H21" />
    </svg>
  );
}

export function AirConIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5 4.2 16.5" />
      <path d="M12 6.6 9.9 4.9M12 6.6l2.1-1.7M12 17.4l-2.1 1.7M12 17.4l2.1 1.7" />
    </svg>
  );
}

export function BatteryIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2.5" y="7.5" width="16" height="9" rx="2" />
      <path d="M18.5 10.5H21v3h-2.5M6 10v4M9.5 12h3" />
    </svg>
  );
}

export function ShieldPoundIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3 4 6v5.5c0 4.4 3.2 8.3 8 9.5 4.8-1.2 8-5.1 8-9.5V6l-8-3Z" />
      <path d="M10 15h4.5M10 12h3M13.4 15c-.9-1-1.4-1.9-1.4-3.1 0-1.3.9-2.2 2.1-2.2.6 0 1.1.2 1.5.5" />
    </svg>
  );
}

export function ClockIcon({ className = base }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </svg>
  );
}
