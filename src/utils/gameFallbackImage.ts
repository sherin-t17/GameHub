type GenreLike = {
  name: string;
  slug: string;
};

const GENRE_THEMES: Record<
  string,
  { start: string; end: string; accent: string; pattern: string }
> = {
  action: { start: "#3a0d16", end: "#d64045", accent: "#ffcb77", pattern: "strikes" },
  adventure: { start: "#0c2431", end: "#2a9d8f", accent: "#e9c46a", pattern: "horizon" },
  rpg: { start: "#24123a", end: "#7b2cbf", accent: "#ffd166", pattern: "runes" },
  shooter: { start: "#101820", end: "#f95738", accent: "#faf0ca", pattern: "targets" },
  indie: { start: "#17202a", end: "#ff6f91", accent: "#f9f871", pattern: "spark" },
  simulation: { start: "#102a43", end: "#3a86ff", accent: "#a8dadc", pattern: "grid" },
  platformer: { start: "#0f172a", end: "#fb8500", accent: "#ffdd57", pattern: "steps" },
  strategy: { start: "#14213d", end: "#588157", accent: "#f4d35e", pattern: "mesh" },
  puzzle: { start: "#1f2041", end: "#4cc9f0", accent: "#f1fa8c", pattern: "tiles" },
  sports: { start: "#132a13", end: "#2dc653", accent: "#ffd166", pattern: "arena" },
  racing: { start: "#111827", end: "#3a86ff", accent: "#ff006e", pattern: "speed" },
  fighting: { start: "#2b0b12", end: "#ef233c", accent: "#edf2f4", pattern: "impact" },
};

const DEFAULT_THEME = {
  start: "#161830",
  end: "#2a2d5a",
  accent: "#c9a84c",
  pattern: "pulse",
};

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const createPatternMarkup = (pattern: string, accent: string) => {
  switch (pattern) {
    case "strikes":
      return `
        <path d="M40 210 L190 20" stroke="${accent}" stroke-width="10" stroke-linecap="round" opacity="0.22"/>
        <path d="M120 250 L270 60" stroke="${accent}" stroke-width="6" stroke-linecap="round" opacity="0.18"/>
      `;
    case "horizon":
      return `
        <circle cx="250" cy="72" r="42" fill="${accent}" opacity="0.18"/>
        <path d="M0 210 C70 170 140 165 220 190 C300 215 360 215 400 205 V260 H0 Z" fill="${accent}" opacity="0.16"/>
      `;
    case "runes":
      return `
        <circle cx="300" cy="76" r="34" fill="none" stroke="${accent}" stroke-width="4" opacity="0.26"/>
        <path d="M88 78 L112 54 L136 78 L112 102 Z" fill="none" stroke="${accent}" stroke-width="4" opacity="0.22"/>
        <path d="M250 180 L285 145 L320 180 L285 215 Z" fill="none" stroke="${accent}" stroke-width="4" opacity="0.16"/>
      `;
    case "targets":
      return `
        <circle cx="300" cy="82" r="38" fill="none" stroke="${accent}" stroke-width="3" opacity="0.22"/>
        <circle cx="300" cy="82" r="20" fill="none" stroke="${accent}" stroke-width="3" opacity="0.18"/>
        <path d="M40 210 L170 120" stroke="${accent}" stroke-width="5" opacity="0.2"/>
      `;
    case "spark":
      return `
        <circle cx="76" cy="60" r="8" fill="${accent}" opacity="0.35"/>
        <circle cx="310" cy="90" r="6" fill="${accent}" opacity="0.3"/>
        <circle cx="240" cy="40" r="4" fill="${accent}" opacity="0.4"/>
        <path d="M130 180 C180 150 235 150 285 180" stroke="${accent}" stroke-width="4" fill="none" opacity="0.18"/>
      `;
    case "grid":
      return `
        <path d="M0 70 H400 M0 120 H400 M0 170 H400 M0 220 H400" stroke="${accent}" stroke-width="2" opacity="0.12"/>
        <path d="M80 0 V260 M160 0 V260 M240 0 V260 M320 0 V260" stroke="${accent}" stroke-width="2" opacity="0.12"/>
      `;
    case "steps":
      return `
        <path d="M40 220 H110 V180 H180 V140 H250 V100 H320" stroke="${accent}" stroke-width="10" fill="none" stroke-linecap="square" opacity="0.18"/>
      `;
    case "mesh":
      return `
        <path d="M40 80 L120 40 L200 80 L280 40 L360 80" stroke="${accent}" stroke-width="3" fill="none" opacity="0.18"/>
        <path d="M40 180 L120 140 L200 180 L280 140 L360 180" stroke="${accent}" stroke-width="3" fill="none" opacity="0.14"/>
        <path d="M120 40 V140 M200 80 V180 M280 40 V140" stroke="${accent}" stroke-width="3" opacity="0.12"/>
      `;
    case "tiles":
      return `
        <rect x="42" y="42" width="42" height="42" rx="8" fill="${accent}" opacity="0.18"/>
        <rect x="94" y="94" width="42" height="42" rx="8" fill="${accent}" opacity="0.12"/>
        <rect x="300" y="48" width="52" height="52" rx="10" fill="${accent}" opacity="0.14"/>
      `;
    case "arena":
      return `
        <ellipse cx="300" cy="80" rx="56" ry="18" fill="${accent}" opacity="0.16"/>
        <path d="M240 80 V125 C240 145 360 145 360 125 V80" fill="none" stroke="${accent}" stroke-width="4" opacity="0.16"/>
      `;
    case "speed":
      return `
        <path d="M20 70 H150 M70 100 H250 M120 130 H360" stroke="${accent}" stroke-width="6" stroke-linecap="round" opacity="0.18"/>
        <path d="M40 190 H200 M140 220 H340" stroke="${accent}" stroke-width="6" stroke-linecap="round" opacity="0.14"/>
      `;
    case "impact":
      return `
        <path d="M200 40 L216 92 L272 92 L226 124 L244 178 L200 144 L156 178 L174 124 L128 92 L184 92 Z" fill="${accent}" opacity="0.16"/>
      `;
    default:
      return `
        <circle cx="320" cy="64" r="54" fill="${accent}" opacity="0.12"/>
        <circle cx="92" cy="204" r="24" fill="${accent}" opacity="0.16"/>
      `;
  }
};

export const getGenreFallbackImage = (name: string, genres: GenreLike[]): string => {
  const primaryGenre = genres[0]?.slug?.toLowerCase() ?? "default";
  const theme = GENRE_THEMES[primaryGenre] ?? DEFAULT_THEME;
  const genreLabel = genres[0]?.name?.toUpperCase() ?? "GAME";
  const safeName = escapeXml(name.toUpperCase());

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.start}" />
          <stop offset="100%" stop-color="${theme.end}" />
        </linearGradient>
      </defs>
      <rect width="400" height="260" fill="url(#bg)" />
      ${createPatternMarkup(theme.pattern, theme.accent)}
      <rect x="22" y="20" width="116" height="28" rx="14" fill="rgba(9,9,15,0.28)" />
      <text x="40" y="39" fill="${theme.accent}" font-size="14" font-family="Arial, sans-serif" font-weight="700" letter-spacing="2">
        ${escapeXml(genreLabel)}
      </text>
      <text x="28" y="198" fill="#f0eee8" font-size="28" font-family="Arial, sans-serif" font-weight="700">
        ${safeName.slice(0, 22)}
      </text>
      <text x="28" y="224" fill="rgba(240,238,232,0.76)" font-size="12" font-family="Arial, sans-serif" letter-spacing="3">
        GAMEHUB PREVIEW
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
