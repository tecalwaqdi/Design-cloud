// Thin-line icons in the brand's gold style.
const P = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const serviceIcons: Record<string, React.ReactNode> = {
  drop: <path {...P} d="M12 3 C 8 9, 6 12, 6 15 a6 6 0 0 0 12 0 c0 -3 -2 -6 -6 -12 Z M9.5 15.5 a2.6 2.6 0 0 0 2.5 2.5" />,
  globe: (
    <g {...P}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12 h18 M12 3 c3 3 3 15 0 18 M12 3 c-3 3 -3 15 0 18" />
    </g>
  ),
  pulse: <path {...P} d="M2 13 h5 l2 -5 l3 10 l3 -8 l2 3 h5" />,
  handshake: <path {...P} d="M3 11 l4 -4 l4 2 l3 -2 l7 5 M7 7 l-4 8 l4 3 l3 -2 l2 2 l2 -1 l2 1 l3 -3 M10 16 l2 2" />,
  sparkle: <path {...P} d="M12 3 C12.8 9 15 11.2 21 12 C15 12.8 12.8 15 12 21 C11.2 15 9 12.8 3 12 C9 11.2 11.2 9 12 3 Z" />,
  truck: <path {...P} d="M2 6 h11 v10 H2 Z M13 10 h4 l4 4 v2 h-8 M6 19 a1.6 1.6 0 1 0 0 -0.1 M17 19 a1.6 1.6 0 1 0 0 -0.1" />,
  shield: <path {...P} d="M12 3 l8 3 v6 c0 5 -4 8 -8 9 c-4 -1 -8 -4 -8 -9 V6 Z M8.5 12 l2.5 2.5 l4.5 -5" />,
  star: <path {...P} d="M12 3 l2.7 5.6 l6.1 .9 l-4.4 4.3 l1 6.1 L12 17 l-5.4 2.9 l1 -6.1 L3.2 9.5 l6.1 -.9 Z" />,
  flask: <path {...P} d="M9 3 h6 M10 3 v6 L4.5 18.5 A1.6 1.6 0 0 0 6 21 h12 a1.6 1.6 0 0 0 1.5 -2.5 L14 9 V3 M7 15 h10" />,
  heart: <path {...P} d="M12 20 C 5 15, 3 11, 3 8.5 A4.5 4.5 0 0 1 12 6 A4.5 4.5 0 0 1 21 8.5 C21 11 19 15 12 20 Z" />,
};

export const iconKeys = Object.keys(serviceIcons);

export function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {serviceIcons[name] ?? serviceIcons.sparkle}
    </svg>
  );
}

const S = { fill: "currentColor" };
export const socialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <g {...P} strokeWidth={1.6}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r=".6" {...S} />
    </g>
  ),
  tiktok: <path {...S} d="M16.6 3c.4 2.2 1.8 3.7 4 3.9v3.1c-1.5 0-2.8-.4-4-1.2v6.1c0 3.5-2.5 6.1-6 6.1a5.8 5.8 0 0 1-5.9-5.9c0-3.4 2.9-6.1 6.4-5.8v3.2c-1.6-.3-3.2.8-3.2 2.6 0 1.5 1.2 2.7 2.7 2.7 1.6 0 2.8-1.2 2.8-3V3h3.2Z" />,
  snapchat: <path {...P} strokeWidth={1.5} d="M12 3c3 0 5 2.3 5 5.2v2.6l1.8-.6c.6 0 .9.7.3 1.1-.8.5-2 .8-2 1.4.6 1.8 2.1 3.2 3.9 3.6-.4.8-1.8 1-2.8 1.2-.2.6-.2 1.2-.6 1.3-.7.1-1.6-.4-2.8 0-1 .3-1.6 1.2-2.8 1.2s-1.8-.9-2.8-1.2c-1.2-.4-2.1.1-2.8 0-.4-.1-.4-.7-.6-1.3-1-.2-2.4-.4-2.8-1.2 1.8-.4 3.3-1.8 3.9-3.6 0-.6-1.2-.9-2-1.4-.6-.4-.3-1.1.3-1.1l1.8.6V8.2C7 5.3 9 3 12 3Z" />,
  x: <path {...S} d="M17.5 3h3.1l-6.8 7.7L21.8 21h-6.2l-4.9-6.3L5 21H1.9l7.3-8.3L1.5 3h6.4l4.4 5.8L17.5 3Zm-1.1 16.2h1.7L7.1 4.7H5.3l11.1 14.5Z" />,
  youtube: <path {...S} d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />,
  linkedin: <path {...S} d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h3v12H3V9Zm6 0h2.9v1.7c.4-.8 1.4-1.9 3.3-1.9 3.5 0 4.1 2.3 4.1 5.3V21h-3v-6c0-1.4 0-3.3-2-3.3s-2.3 1.6-2.3 3.2V21H9V9Z" />,
  whatsapp: <path {...S} d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.5 21.5l4.9-1.3A9.4 9.4 0 1 0 12 2.5Zm0 17.2c-1.5 0-2.9-.4-4.1-1.1l-.3-.2-2.9.8.8-2.8-.2-.3A7.8 7.8 0 1 1 12 19.7Zm4.3-5.8c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1l-.8.9c-.1.2-.3.2-.5.1a6.4 6.4 0 0 1-3.2-2.8c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.7-1.7c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.4Z" />,
};

export function Social({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {socialIcons[name]}
    </svg>
  );
}
