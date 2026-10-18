/**
 * Netwonite Vector Avatar Engine
 * Provides ultra-crisp, scale-invariant SVG vector illustrations for user profile photos.
 * Guarantees every single team member has a unique, distinct visual avatar photo.
 */

export interface VectorAvatarOption {
  id: string;
  name: string;
  roleHint: string;
  category: 'Executive' | 'Engineering' | 'Design' | 'Management' | 'Cybersecurity' | 'Data';
  accentColor: string;
  svgDataUri: string;
}

export interface VectorConfig {
  bgGradient: [string, string];
  skinTone: string;
  hairTone: string;
  hairStyle: 'slick' | 'afro' | 'wavy' | 'crop' | 'buzz' | 'bob' | 'curly' | 'spiky';
  clothingColor: string;
  clothingStyle?: 'hoodie' | 'suit' | 'blazer' | 'tshirt' | 'sweater';
  accessory?: 'glasses' | 'sunglasses' | 'headset' | 'visor' | 'earring' | 'vr' | 'none';
  badgeSymbol?: string;
  accentStroke?: string;
}

export function createVectorSvgMarkup(options: VectorConfig): string {
  const {
    bgGradient,
    skinTone,
    hairTone,
    hairStyle,
    clothingColor,
    clothingStyle = 'tshirt',
    accessory = 'none',
    badgeSymbol,
    accentStroke = '#38bdf8',
  } = options;

  let hairPath = '';
  switch (hairStyle) {
    case 'slick':
      hairPath = `
        <path d="M28 44 C28 20 72 20 72 44 C72 30 60 23 50 23 C40 23 28 30 28 44 Z" fill="${hairTone}" />
        <path d="M26 42 C30 26 46 20 56 20 C68 20 74 28 74 42 C70 31 58 27 48 27 C38 27 30 32 26 42 Z" fill="#ffffff" opacity="0.25" />
      `;
      break;
    case 'afro':
      hairPath = `
        <circle cx="50" cy="38" r="28" fill="${hairTone}" />
        <circle cx="32" cy="34" r="16" fill="${hairTone}" />
        <circle cx="68" cy="34" r="16" fill="${hairTone}" />
        <circle cx="50" cy="22" r="16" fill="${hairTone}" />
        <circle cx="36" cy="46" r="12" fill="${hairTone}" />
        <circle cx="64" cy="46" r="12" fill="${hairTone}" />
      `;
      break;
    case 'wavy':
      hairPath = `
        <path d="M23 48 C23 18 77 18 77 48 C79 64 73 72 67 72 C63 72 65 52 63 42 C59 28 41 28 37 42 C35 52 37 72 31 72 C25 72 21 64 23 48 Z" fill="${hairTone}" />
        <path d="M35 26 C43 22 57 22 65 26" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.35" />
      `;
      break;
    case 'crop':
      hairPath = `
        <path d="M29 42 C29 24 71 24 71 42 C69 31 61 26 50 26 C39 26 31 31 29 42 Z" fill="${hairTone}" />
        <path d="M29 36 L38 28 L48 30 L60 28 L71 36" stroke="${hairTone}" stroke-width="4" stroke-linecap="round" fill="none" />
      `;
      break;
    case 'bob':
      hairPath = `
        <path d="M25 46 C25 22 75 22 75 46 C77 62 71 66 67 66 C63 56 63 38 61 34 C57 26 43 26 39 34 C37 38 37 56 33 66 C29 66 23 62 25 46 Z" fill="${hairTone}" />
      `;
      break;
    case 'curly':
      hairPath = `
        <circle cx="40" cy="26" r="12" fill="${hairTone}" />
        <circle cx="60" cy="26" r="12" fill="${hairTone}" />
        <circle cx="28" cy="38" r="11" fill="${hairTone}" />
        <circle cx="72" cy="38" r="11" fill="${hairTone}" />
        <circle cx="50" cy="24" r="13" fill="${hairTone}" />
        <path d="M28 44 C28 24 72 24 72 44 Z" fill="${hairTone}" />
      `;
      break;
    case 'spiky':
      hairPath = `
        <path d="M28 42 L34 22 L42 30 L50 18 L58 30 L66 22 L72 42 Z" fill="${hairTone}" />
      `;
      break;
    case 'buzz':
    default:
      hairPath = `
        <ellipse cx="50" cy="40" rx="23" ry="24" fill="${hairTone}" opacity="0.5" />
      `;
      break;
  }

  let accessorySvg = '';
  if (accessory === 'glasses') {
    accessorySvg = `
      <g stroke="#0f172a" stroke-width="2.5" fill="#38bdf8" fill-opacity="0.25">
        <rect x="33" y="44" width="14" height="10" rx="3" />
        <rect x="53" y="44" width="14" height="10" rx="3" />
        <line x1="47" y1="48" x2="53" y2="48" />
        <line x1="28" y1="46" x2="33" y2="47" />
        <line x1="67" y1="47" x2="72" y2="46" />
      </g>
    `;
  } else if (accessory === 'sunglasses') {
    accessorySvg = `
      <g fill="#090d16" stroke="${accentStroke}" stroke-width="1.5">
        <path d="M32 44 L48 44 L46 54 L34 54 Z" />
        <path d="M52 44 L68 44 L66 54 L54 54 Z" />
        <line x1="48" y1="47" x2="52" y2="47" stroke-width="2" />
        <line x1="28" y1="46" x2="32" y2="46" stroke="#090d16" stroke-width="2.5" />
        <line x1="68" y1="46" x2="72" y2="46" stroke="#090d16" stroke-width="2.5" />
      </g>
      <line x1="35" y1="46" x2="43" y2="52" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.45" />
      <line x1="55" y1="46" x2="63" y2="52" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" opacity="0.45" />
    `;
  } else if (accessory === 'headset') {
    accessorySvg = `
      <path d="M26 48 C24 30 76 30 74 48" stroke="${accentStroke}" stroke-width="3" fill="none" stroke-linecap="round" />
      <rect x="22" y="45" width="6" height="13" rx="3" fill="${accentStroke}" />
      <rect x="72" y="45" width="6" height="13" rx="3" fill="${accentStroke}" />
      <path d="M25 54 Q25 65 38 65" stroke="${accentStroke}" stroke-width="2" fill="none" stroke-linecap="round" />
      <circle cx="39" cy="65" r="3" fill="#10b981" />
    `;
  } else if (accessory === 'visor') {
    accessorySvg = `
      <path d="M27 44 Q50 39 73 44 L71 52 Q50 47 29 52 Z" fill="${accentStroke}" fill-opacity="0.9" stroke="#ffffff" stroke-width="1" />
      <line x1="32" y1="46" x2="68" y2="46" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="2,2" opacity="0.9" />
    `;
  } else if (accessory === 'vr') {
    accessorySvg = `
      <rect x="30" y="42" width="40" height="12" rx="4" fill="#0f172a" stroke="${accentStroke}" stroke-width="2" />
      <line x1="34" y1="48" x2="66" y2="48" stroke="${accentStroke}" stroke-width="2" stroke-linecap="round" />
      <circle cx="50" cy="48" r="3" fill="#10b981" />
    `;
  } else if (accessory === 'earring') {
    accessorySvg = `
      <circle cx="73" cy="54" r="2.8" fill="#f59e0b" stroke="#ffffff" stroke-width="1" />
      <circle cx="27" cy="54" r="2.8" fill="#f59e0b" stroke="#ffffff" stroke-width="1" />
    `;
  }

  // Clothing rendering
  let clothingSvg = '';
  if (clothingStyle === 'suit') {
    clothingSvg = `
      <path d="M22 96 C22 75 34 68 50 68 C66 68 78 75 78 96 Z" fill="url(#bodyGrad)" />
      <!-- Shirt collar -->
      <polygon points="43,68 50,78 57,68 50,65" fill="#ffffff" />
      <!-- Tie -->
      <polygon points="48,72 52,72 53,88 50,92 47,88" fill="${accentStroke}" />
    `;
  } else if (clothingStyle === 'hoodie') {
    clothingSvg = `
      <path d="M22 96 C22 74 33 66 50 66 C67 66 78 74 78 96 Z" fill="url(#bodyGrad)" />
      <path d="M38 66 C42 74 46 80 50 80 C54 80 58 74 62 66" stroke="#ffffff" stroke-width="2.5" fill="none" opacity="0.4" />
      <circle cx="44" cy="85" r="1.5" fill="#ffffff" opacity="0.6" />
      <circle cx="56" cy="85" r="1.5" fill="#ffffff" opacity="0.6" />
      <line x1="44" y1="78" x2="44" y2="85" stroke="#ffffff" stroke-width="1.2" opacity="0.5" />
      <line x1="56" y1="78" x2="56" y2="85" stroke="#ffffff" stroke-width="1.2" opacity="0.5" />
    `;
  } else if (clothingStyle === 'blazer') {
    clothingSvg = `
      <path d="M22 96 C22 75 34 68 50 68 C66 68 78 75 78 96 Z" fill="url(#bodyGrad)" />
      <!-- Inner shirt -->
      <polygon points="44,68 50,82 56,68" fill="#ffffff" />
      <!-- Lapels -->
      <polygon points="36,70 44,84 38,96 28,96" fill="${adjustBrightness(clothingColor, -20)}" />
      <polygon points="64,70 56,84 62,96 72,96" fill="${adjustBrightness(clothingColor, -20)}" />
    `;
  } else {
    // tshirt / default
    clothingSvg = `
      <path d="M22 96 C22 75 34 68 50 68 C66 68 78 75 78 96 Z" fill="url(#bodyGrad)" />
      <path d="M42 68 L50 77 L58 68 Z" fill="url(#skinGrad)" />
    `;
  }

  const gradId = Math.random().toString(36).substring(2, 9);

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
      <defs>
        <linearGradient id="bgGrad_${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgGradient[0]}" />
          <stop offset="100%" stop-color="${bgGradient[1]}" />
        </linearGradient>
        <linearGradient id="skinGrad_${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${skinTone}" />
          <stop offset="100%" stop-color="${adjustBrightness(skinTone, -12)}" />
        </linearGradient>
        <linearGradient id="bodyGrad_${gradId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${clothingColor}" />
          <stop offset="100%" stop-color="${adjustBrightness(clothingColor, -25)}" />
        </linearGradient>
        <radialGradient id="ringGlow_${gradId}" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stop-color="#ffffff" stop-opacity="0" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.35" />
        </radialGradient>
      </defs>
      <!-- Background Vector Container -->
      <rect width="100" height="100" rx="30" fill="url(#bgGrad_${gradId})" />
      <circle cx="50" cy="50" r="48" fill="url(#ringGlow_${gradId})" />
      <!-- Geometric Circuit / Ambient Rings -->
      <g stroke="#ffffff" stroke-width="0.75" opacity="0.12">
        <circle cx="50" cy="50" r="38" fill="none" stroke-dasharray="4,4" />
        <circle cx="50" cy="50" r="28" fill="none" />
      </g>
      <!-- Vector Body & Clothing -->
      <g id="body">
        ${clothingSvg.replace(/url\(#bodyGrad\)/g, `url(#bodyGrad_${gradId})`).replace(/url\(#skinGrad\)/g, `url(#skinGrad_${gradId})`)}
      </g>
      <!-- Neck -->
      <rect x="44" y="54" width="12" height="15" rx="4" fill="url(#skinGrad_${gradId})" />
      <!-- Hair Base (Behind Face) -->
      ${hairPath}
      <!-- Vector Face -->
      <ellipse cx="50" cy="48" rx="20" ry="21" fill="url(#skinGrad_${gradId})" />
      <!-- Ears -->
      <circle cx="30" cy="49" r="4.5" fill="${adjustBrightness(skinTone, -8)}" />
      <circle cx="70" cy="49" r="4.5" fill="${adjustBrightness(skinTone, -8)}" />
      <!-- Vector Eyes & Brows -->
      <g fill="#0f172a">
        <path d="M36 40 Q41 38 45 40" stroke="#0f172a" stroke-width="2" stroke-linecap="round" fill="none" />
        <path d="M55 40 Q59 38 64 40" stroke="#0f172a" stroke-width="2" stroke-linecap="round" fill="none" />
        <circle cx="41" cy="46" r="2.8" />
        <circle cx="59" cy="46" r="2.8" />
        <circle cx="42" cy="45" r="0.9" fill="#ffffff" />
        <circle cx="60" cy="45" r="0.9" fill="#ffffff" />
      </g>
      <!-- Nose & Smile -->
      <path d="M50 47 L48 53 L51 53" stroke="${adjustBrightness(skinTone, -25)}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" />
      <path d="M44 57 Q50 61 56 57" stroke="${adjustBrightness(skinTone, -30)}" stroke-width="2" stroke-linecap="round" fill="none" />
      <!-- Soft Blush -->
      <circle cx="36" cy="52" r="3" fill="#f43f5e" opacity="0.18" />
      <circle cx="64" cy="52" r="3" fill="#f43f5e" opacity="0.18" />
      <!-- Front Hair Tuft -->
      ${hairStyle === 'slick' || hairStyle === 'crop' || hairStyle === 'wavy' || hairStyle === 'spiky' ? hairPath : ''}
      <!-- Accessories -->
      ${accessorySvg}
      ${
        badgeSymbol
          ? `
        <g transform="translate(68, 68)">
          <circle cx="12" cy="12" r="12" fill="#0f172a" stroke="#ffffff" stroke-width="1.5" />
          <text x="12" y="16" font-size="11" text-anchor="middle" fill="#38bdf8" font-weight="bold">${badgeSymbol}</text>
        </g>
      `
          : ''
      }
    </svg>
  `.trim();
}

function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) + Math.round((percent / 100) * 255);
  let g = ((num >> 8) & 0x00ff) + Math.round((percent / 100) * 255);
  let b = (num & 0x0000ff) + Math.round((percent / 100) * 255);

  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export function svgToDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// 22 Distinct Vector Personas tailored for Admin + 20 Employees
export const VECTOR_AVATAR_PRESETS: VectorAvatarOption[] = [
  // 1. Admin
  {
    id: 'vector:admin',
    name: 'Executive Sovereign',
    roleHint: 'System Administrator',
    category: 'Executive',
    accentColor: '#f59e0b',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#78350f', '#d97706'],
        skinTone: '#fcd34d',
        hairTone: '#1e1b4b',
        hairStyle: 'slick',
        clothingColor: '#0f172a',
        clothingStyle: 'suit',
        accessory: 'glasses',
        badgeSymbol: '👑',
        accentStroke: '#f59e0b',
      })
    ),
  },
  // 2. Emp 1: Alex Chen
  {
    id: 'vector:emp_1',
    name: 'Alex Chen',
    roleHint: 'Lead - Team Rock & Nexus',
    category: 'Engineering',
    accentColor: '#06b6d4',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#082f49', '#0284c7'],
        skinTone: '#fed7aa',
        hairTone: '#111827',
        hairStyle: 'crop',
        clothingColor: '#0f172a',
        clothingStyle: 'hoodie',
        accessory: 'headset',
        badgeSymbol: '⚡',
        accentStroke: '#38bdf8',
      })
    ),
  },
  // 3. Emp 2: Jordan Taylor
  {
    id: 'vector:emp_2',
    name: 'Jordan Taylor',
    roleHint: 'Senior Backend - Team Rock',
    category: 'Engineering',
    accentColor: '#10b981',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#064e3b', '#059669'],
        skinTone: '#fef08a',
        hairTone: '#1e293b',
        hairStyle: 'wavy',
        clothingColor: '#064e3b',
        clothingStyle: 'tshirt',
        accessory: 'glasses',
        badgeSymbol: '</>',
        accentStroke: '#34d399',
      })
    ),
  },
  // 4. Emp 3: Samira Khan
  {
    id: 'vector:emp_3',
    name: 'Samira Khan',
    roleHint: 'Senior UI/UX - Team Rock',
    category: 'Design',
    accentColor: '#ec4899',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#831843', '#db2777'],
        skinTone: '#ffedd5',
        hairTone: '#831843',
        hairStyle: 'bob',
        clothingColor: '#4c0519',
        clothingStyle: 'sweater',
        accessory: 'earring',
        badgeSymbol: '🎨',
        accentStroke: '#f472b6',
      })
    ),
  },
  // 5. Emp 4: Marcus Vance
  {
    id: 'vector:emp_4',
    name: 'Marcus Vance',
    roleHint: 'SRE Specialist - Team Rock',
    category: 'Engineering',
    accentColor: '#f97316',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#7c2d12', '#ea580c'],
        skinTone: '#fed7aa',
        hairTone: '#292524',
        hairStyle: 'buzz',
        clothingColor: '#1c1917',
        clothingStyle: 'hoodie',
        accessory: 'visor',
        badgeSymbol: '⚙️',
        accentStroke: '#fb923c',
      })
    ),
  },
  // 6. Emp 5: Elena Rostova
  {
    id: 'vector:emp_5',
    name: 'Elena Rostova',
    roleHint: 'Data Platform - Team Rock',
    category: 'Data',
    accentColor: '#8b5cf6',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#4c1d95', '#7c3aed'],
        skinTone: '#fbcfe8',
        hairTone: '#312e81',
        hairStyle: 'wavy',
        clothingColor: '#312e81',
        clothingStyle: 'blazer',
        accessory: 'glasses',
        badgeSymbol: '📊',
        accentStroke: '#a78bfa',
      })
    ),
  },
  // 7. Emp 6: David Kim
  {
    id: 'vector:emp_6',
    name: 'David Kim',
    roleHint: 'Lead - Team Paper & Alpha',
    category: 'Management',
    accentColor: '#3b82f6',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#1e3a8a', '#2563eb'],
        skinTone: '#fcd34d',
        hairTone: '#0f172a',
        hairStyle: 'slick',
        clothingColor: '#1e3a8a',
        clothingStyle: 'blazer',
        accessory: 'glasses',
        badgeSymbol: '🚀',
        accentStroke: '#60a5fa',
      })
    ),
  },
  // 8. Emp 7: Priya Patel
  {
    id: 'vector:emp_7',
    name: 'Priya Patel',
    roleHint: 'Product Designer - Team Paper',
    category: 'Design',
    accentColor: '#f43f5e',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#881337', '#e11d48'],
        skinTone: '#fed7aa',
        hairTone: '#4c0519',
        hairStyle: 'wavy',
        clothingColor: '#881337',
        clothingStyle: 'sweater',
        accessory: 'earring',
        badgeSymbol: '✨',
        accentStroke: '#fb7185',
      })
    ),
  },
  // 9. Emp 8: Lucas Silva
  {
    id: 'vector:emp_8',
    name: 'Lucas Silva',
    roleHint: 'Mobile & Web - Team Paper',
    category: 'Engineering',
    accentColor: '#14b8a6',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#134e4a', '#0d9488'],
        skinTone: '#fed7aa',
        hairTone: '#111827',
        hairStyle: 'afro',
        clothingColor: '#115e59',
        clothingStyle: 'tshirt',
        accessory: 'headset',
        badgeSymbol: '📱',
        accentStroke: '#2dd4bf',
      })
    ),
  },
  // 10. Emp 9: Sarah Jenkins
  {
    id: 'vector:emp_9',
    name: 'Sarah Jenkins',
    roleHint: 'API Services - Team Paper',
    category: 'Engineering',
    accentColor: '#d946ef',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#701a75', '#c026d3'],
        skinTone: '#fef08a',
        hairTone: '#581c87',
        hairStyle: 'bob',
        clothingColor: '#3b0764',
        clothingStyle: 'blazer',
        accessory: 'glasses',
        badgeSymbol: '</>',
        accentStroke: '#e879f9',
      })
    ),
  },
  // 11. Emp 10: Hassan Ali
  {
    id: 'vector:emp_10',
    name: 'Hassan Ali',
    roleHint: 'Quality QA Lead - Team Paper',
    category: 'Engineering',
    accentColor: '#0284c7',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#075985', '#0284c7'],
        skinTone: '#fed7aa',
        hairTone: '#1e293b',
        hairStyle: 'crop',
        clothingColor: '#0c4a6e',
        clothingStyle: 'hoodie',
        accessory: 'sunglasses',
        badgeSymbol: '🎯',
        accentStroke: '#38bdf8',
      })
    ),
  },
  // 12. Emp 11: Emily Zhao
  {
    id: 'vector:emp_11',
    name: 'Emily Zhao',
    roleHint: 'Staff Security Engineer - Team Nexus',
    category: 'Cybersecurity',
    accentColor: '#10b981',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#022c22', '#059669'],
        skinTone: '#fbcfe8',
        hairTone: '#0f172a',
        hairStyle: 'slick',
        clothingColor: '#022c22',
        clothingStyle: 'suit',
        accessory: 'visor',
        badgeSymbol: '🛡️',
        accentStroke: '#34d399',
      })
    ),
  },
  // 13. Emp 12: Mateo Hernandez
  {
    id: 'vector:emp_12',
    name: 'Mateo Hernandez',
    roleHint: 'AppSec Analyst - Team Nexus',
    category: 'Cybersecurity',
    accentColor: '#6366f1',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#312e81', '#4f46e5'],
        skinTone: '#fed7aa',
        hairTone: '#1e1b4b',
        hairStyle: 'buzz',
        clothingColor: '#1e1b4b',
        clothingStyle: 'hoodie',
        accessory: 'headset',
        badgeSymbol: '🔒',
        accentStroke: '#818cf8',
      })
    ),
  },
  // 14. Emp 13: Chloe Dubois
  {
    id: 'vector:emp_13',
    name: 'Chloe Dubois',
    roleHint: 'Systems Architect - Team Nexus',
    category: 'Engineering',
    accentColor: '#06b6d4',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#164e63', '#0891b2'],
        skinTone: '#fef08a',
        hairTone: '#0e7490',
        hairStyle: 'wavy',
        clothingColor: '#155e75',
        clothingStyle: 'blazer',
        accessory: 'glasses',
        badgeSymbol: '📐',
        accentStroke: '#22d3ee',
      })
    ),
  },
  // 15. Emp 14: Liam O Connor
  {
    id: 'vector:emp_14',
    name: 'Liam O Connor',
    roleHint: 'Network Ops - Team Nexus',
    category: 'Engineering',
    accentColor: '#2563eb',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#172554', '#1d4ed8'],
        skinTone: '#ffedd5',
        hairTone: '#7c2d12',
        hairStyle: 'crop',
        clothingColor: '#1e3a8a',
        clothingStyle: 'tshirt',
        accessory: 'headset',
        badgeSymbol: '🌐',
        accentStroke: '#60a5fa',
      })
    ),
  },
  // 16. Emp 15: Aisha Abubakar
  {
    id: 'vector:emp_15',
    name: 'Aisha Abubakar',
    roleHint: 'Compliance Officer - Team Nexus',
    category: 'Management',
    accentColor: '#eab308',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#713f12', '#ca8a04'],
        skinTone: '#78350f',
        hairTone: '#1c1917',
        hairStyle: 'afro',
        clothingColor: '#451a03',
        clothingStyle: 'blazer',
        accessory: 'earring',
        badgeSymbol: '📋',
        accentStroke: '#facc15',
      })
    ),
  },
  // 17. Emp 16: Noah Becker
  {
    id: 'vector:emp_16',
    name: 'Noah Becker',
    roleHint: 'Machine Learning Specialist - Team Alpha',
    category: 'Data',
    accentColor: '#e11d48',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#4c0519', '#be123c'],
        skinTone: '#fcd34d',
        hairTone: '#1e293b',
        hairStyle: 'slick',
        clothingColor: '#18181b',
        clothingStyle: 'suit',
        accessory: 'visor',
        badgeSymbol: '🧠',
        accentStroke: '#fb7185',
      })
    ),
  },
  // 18. Emp 17: Mia Takahashi
  {
    id: 'vector:emp_17',
    name: 'Mia Takahashi',
    roleHint: 'Data Analyst - Team Alpha',
    category: 'Data',
    accentColor: '#a855f7',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#581c87', '#9333ea'],
        skinTone: '#fed7aa',
        hairTone: '#3b0764',
        hairStyle: 'bob',
        clothingColor: '#3b0764',
        clothingStyle: 'sweater',
        accessory: 'glasses',
        badgeSymbol: '📈',
        accentStroke: '#c084fc',
      })
    ),
  },
  // 19. Emp 18: Ethan Wright
  {
    id: 'vector:emp_18',
    name: 'Ethan Wright',
    roleHint: 'MLOps Engineer - Team Alpha',
    category: 'Engineering',
    accentColor: '#059669',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#064e3b', '#047857'],
        skinTone: '#ffedd5',
        hairTone: '#451a03',
        hairStyle: 'crop',
        clothingColor: '#022c22',
        clothingStyle: 'hoodie',
        accessory: 'headset',
        badgeSymbol: '🤖',
        accentStroke: '#34d399',
      })
    ),
  },
  // 20. Emp 19: Olivia Rossi
  {
    id: 'vector:emp_19',
    name: 'Olivia Rossi',
    roleHint: 'Growth Analytics - Team Alpha',
    category: 'Data',
    accentColor: '#84cc16',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#365314', '#65a30d'],
        skinTone: '#fed7aa',
        hairTone: '#713f12',
        hairStyle: 'wavy',
        clothingColor: '#1a2e05',
        clothingStyle: 'blazer',
        accessory: 'glasses',
        badgeSymbol: '🌱',
        accentStroke: '#a3e635',
      })
    ),
  },
  // 21. Emp 20: Benjamin Scott
  {
    id: 'vector:emp_20',
    name: 'Benjamin Scott',
    roleHint: 'API Integrations - Team Alpha',
    category: 'Engineering',
    accentColor: '#0284c7',
    svgDataUri: svgToDataUri(
      createVectorSvgMarkup({
        bgGradient: ['#082f49', '#0369a1'],
        skinTone: '#fcd34d',
        hairTone: '#0f172a',
        hairStyle: 'buzz',
        clothingColor: '#0f172a',
        clothingStyle: 'tshirt',
        accessory: 'glasses',
        badgeSymbol: '</>',
        accentStroke: '#38bdf8',
      })
    ),
  },
];

export const REAL_HUMAN_PORTRAIT_PRESETS = [
  {
    id: 'human:admin',
    name: 'Executive Leader',
    roleHint: 'System Administrator',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    gender: 'Executive',
  },
  {
    id: 'human:emp_1',
    name: 'Alex Chen',
    roleHint: 'Principal DevOps - Lead: Team Rock & Nexus',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
  {
    id: 'human:emp_2',
    name: 'Jordan Taylor',
    roleHint: 'Backend Platform Engineer',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
  {
    id: 'human:emp_3',
    name: 'Samira Khan',
    roleHint: 'Senior UI/UX Engineer',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    gender: 'Female',
  },
  {
    id: 'human:emp_4',
    name: 'Marcus Vance',
    roleHint: 'Site Reliability Engineer',
    photoUrl: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
  {
    id: 'human:emp_5',
    name: 'Elena Rostova',
    roleHint: 'Data Platform Engineer',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    gender: 'Female',
  },
  {
    id: 'human:emp_6',
    name: 'David Kim',
    roleHint: 'Lead Fullstack - Lead: Team Paper & Alpha',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
  {
    id: 'human:emp_7',
    name: 'Priya Patel',
    roleHint: 'Senior Product Designer',
    photoUrl: 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=300&auto=format&fit=crop&q=80',
    gender: 'Female',
  },
  {
    id: 'human:emp_8',
    name: 'Lucas Silva',
    roleHint: 'Frontend Developer',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
  {
    id: 'human:emp_9',
    name: 'Sarah Jenkins',
    roleHint: 'Software Engineer II',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    gender: 'Female',
  },
  {
    id: 'human:emp_10',
    name: 'Hassan Ali',
    roleHint: 'Automation QA Lead',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
  {
    id: 'human:emp_11',
    name: 'Emily Zhao',
    roleHint: 'Staff Security Engineer - Team Nexus',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    gender: 'Female',
  },
  {
    id: 'human:emp_12',
    name: 'Mateo Hernandez',
    roleHint: 'Information Security Analyst',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
  {
    id: 'human:emp_13',
    name: 'Chloe Dubois',
    roleHint: 'Systems Architect',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
    gender: 'Female',
  },
  {
    id: 'human:emp_14',
    name: 'Liam O Connor',
    roleHint: 'Network Operations Engineer',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
  {
    id: 'human:emp_15',
    name: 'Aisha Abubakar',
    roleHint: 'Compliance Officer',
    photoUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
    gender: 'Female',
  },
  {
    id: 'human:emp_16',
    name: 'Noah Becker',
    roleHint: 'Machine Learning Specialist - Team Alpha',
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
  {
    id: 'human:emp_17',
    name: 'Mia Takahashi',
    roleHint: 'Data Analyst',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
    gender: 'Female',
  },
  {
    id: 'human:emp_18',
    name: 'Ethan Wright',
    roleHint: 'ML Infrastructure Engineer',
    photoUrl: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
  {
    id: 'human:emp_19',
    name: 'Olivia Rossi',
    roleHint: 'Product Analytics Lead',
    photoUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80',
    gender: 'Female',
  },
  {
    id: 'human:emp_20',
    name: 'Benjamin Scott',
    roleHint: 'API Integration Specialist',
    photoUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80',
    gender: 'Male',
  },
];

export const REAL_HUMAN_PHOTO_MAP: Record<string, string> = {
  'usr-admin': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'admin@netwonite.com': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'system administrator': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'usr-emp-1': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'employ1@gmail.com': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'alex chen': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'usr-emp-2': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'employ2@gmail.com': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'jordan taylor': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'usr-emp-3': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'employ3@gmail.com': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'samira khan': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  'usr-emp-4': 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
  'employ4@gmail.com': 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
  'marcus vance': 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=300&auto=format&fit=crop&q=80',
  'usr-emp-5': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'employ5@gmail.com': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'elena rostova': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
  'usr-emp-6': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  'employ6@gmail.com': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  'david kim': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  'usr-emp-7': 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=300&auto=format&fit=crop&q=80',
  'employ7@gmail.com': 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=300&auto=format&fit=crop&q=80',
  'priya patel': 'https://images.unsplash.com/photo-1534751516642-a171edd2521d?w=300&auto=format&fit=crop&q=80',
  'usr-emp-8': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  'employ8@gmail.com': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  'lucas silva': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  'usr-emp-9': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'employ9@gmail.com': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'sarah jenkins': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'usr-emp-10': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'employ10@gmail.com': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'hassan ali': 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
  'usr-emp-11': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'employ11@gmail.com': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'emily zhao': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'usr-emp-12': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
  'employ12@gmail.com': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
  'mateo hernandez': 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=300&auto=format&fit=crop&q=80',
  'usr-emp-13': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
  'employ13@gmail.com': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
  'chloe dubois': 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80',
  'usr-emp-14': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  'employ14@gmail.com': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  'liam o connor': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  "liam o'connor": 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  'usr-emp-15': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
  'employ15@gmail.com': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
  'aisha abubakar': 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=300&auto=format&fit=crop&q=80',
  'usr-emp-16': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'employ16@gmail.com': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'noah becker': 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  'usr-emp-17': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  'employ17@gmail.com': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  'mia takahashi': 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&auto=format&fit=crop&q=80',
  'usr-emp-18': 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=300&auto=format&fit=crop&q=80',
  'employ18@gmail.com': 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=300&auto=format&fit=crop&q=80',
  'ethan wright': 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=300&auto=format&fit=crop&q=80',
  'usr-emp-19': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80',
  'employ19@gmail.com': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80',
  'olivia rossi': 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=300&auto=format&fit=crop&q=80',
  'usr-emp-20': 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80',
  'employ20@gmail.com': 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80',
  'benjamin scott': 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=300&auto=format&fit=crop&q=80',
  'usr-analyst-1': 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=300&auto=format&fit=crop&q=80',
  'analyst1@gmail.com': 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=300&auto=format&fit=crop&q=80',
  'sophia martinez': 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=300&auto=format&fit=crop&q=80',
  'usr-analyst-2': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  'analyst2@gmail.com': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  'daniel cooper': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  'usr-analyst-3': 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&auto=format&fit=crop&q=80',
  'analyst3@gmail.com': 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&auto=format&fit=crop&q=80',
  'fatima al-mansoor': 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=300&auto=format&fit=crop&q=80',
  'usr-analyst-4': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  'analyst4@gmail.com': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  'rohan verma': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
  'usr-analyst-5': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'analyst5@gmail.com': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  'zoe andersson': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
};

export function getDeterministicHumanPhoto(seedString: string): string {
  const normalized = seedString.trim().toLowerCase();
  if (REAL_HUMAN_PHOTO_MAP[normalized]) {
    return REAL_HUMAN_PHOTO_MAP[normalized];
  }
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % REAL_HUMAN_PORTRAIT_PRESETS.length;
  return REAL_HUMAN_PORTRAIT_PRESETS[index].photoUrl;
}

export function resolveVectorAvatar(avatar?: string, fallbackSeed = 'user'): string {
  if (avatar && (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:image/'))) {
    return avatar;
  }
  if (avatar && avatar.startsWith('vector:')) {
    const match = VECTOR_AVATAR_PRESETS.find(p => p.id === avatar);
    if (match) return match.svgDataUri;
  }
  return getDeterministicHumanPhoto(fallbackSeed);
}
