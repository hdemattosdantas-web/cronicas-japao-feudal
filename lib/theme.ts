/**
 * Theme Provider para Mesa Feudal
 * Define cores, tipografia e configurações visuais consistentes
 */

export const theme = {
  // ===================================================
  // PALETA DE CORES
  // ===================================================
  colors: {
    // Fundo e superfícies
    coalBlack: '#0a0a0a',
    ancientPaper: '#f4f1e8',
    parchmentDark: '#e8dcc0',
    inkBlack: '#1a1a1a',

    // Destaques sóbrios
    goldDulled: '#b8860b',
    redDark: '#8b0000',

    // Bordas e detalhes
    borderLight: '#d4c5a9',
    borderDark: '#8b7355',
  },

  // ===================================================
  // TIPOGRAFIA
  // ===================================================
  fonts: {
    title: "'Cinzel', serif",
    narrative: "'Libre Baskerville', serif",
    interface: "'Inter', sans-serif",
  },

  // ===================================================
  // TAMANHOS TIPOGRÁFICOS
  // ===================================================
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },

  // ===================================================
  // ESPAÇAMENTO E LAYOUT
  // ===================================================
  spacing: {
    container: {
      maxWidth: '1200px',
      padding: '2rem',
    },
    card: {
      padding: '2rem',
      margin: '1.5rem 0',
      borderRadius: '8px',
    },
    button: {
      padding: '0.875rem 2rem',
      borderRadius: '6px',
    },
  },

  // ===================================================
  // SOMBRAS
  // ===================================================
  shadows: {
    primary: 'rgba(184, 134, 11, 0.15)',
    secondary: 'rgba(139, 0, 0, 0.1)',
    parchment: '0 4px 6px rgba(184, 134, 11, 0.15), 0 1px 3px rgba(139, 0, 0, 0.1)',
    scroll: '0 8px 16px rgba(184, 134, 11, 0.15), 0 2px 4px rgba(139, 0, 0, 0.1)',
  },

  // ===================================================
  // GRADIENTES
  // ===================================================
  gradients: {
    paper: 'linear-gradient(135deg, #f4f1e8 0%, #e8dcc0 100%)',
    dark: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
  },

  // ===================================================
  // CLASSES UTILITÁRIAS
  // ===================================================
  classes: {
    // Tipografia
    title: {
      hero: 'title-hero',
      section: 'title-section',
      card: 'title-card',
    },
    narrative: {
      lead: 'narrative-lead',
      body: 'narrative-body',
      italic: 'narrative-italic',
    },
    interface: {
      label: 'interface-label',
      body: 'interface-body',
      small: 'interface-small',
    },

    // Componentes
    card: 'card',
    parchment: 'parchment',
    scroll: 'scroll',

    // Botões
    button: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
    },

    // Utilitários
    text: {
      center: 'text-center',
      gold: 'text-gold',
      red: 'text-red',
      muted: 'text-muted',
    },
    bg: {
      paper: 'bg-paper',
      coal: 'bg-coal',
    },

    // Animações
    animation: {
      fadeIn: 'fade-in',
      fadeInSlow: 'fade-in-slow',
      slideUp: 'slide-up',
    },
  },
} as const;

// ===================================================
// TIPOS TYPESCRIPT
// ===================================================

export type ThemeColors = typeof theme.colors;
export type ThemeFonts = typeof theme.fonts;
export type ThemeFontSize = typeof theme.fontSize;
export type ThemeSpacing = typeof theme.spacing;
export type ThemeShadows = typeof theme.shadows;
export type ThemeClasses = typeof theme.classes;

// ===================================================
// HOOK PARA USAR O THEME
// ===================================================

export function useTheme() {
  return theme;
}

// ===================================================
// UTILITÁRIOS PARA COMPONENTES
// ===================================================

export function getThemeClass(...classNames: (string | undefined | null)[]): string {
  return classNames.filter(Boolean).join(' ');
}

export function getThemeColor(color: keyof ThemeColors): string {
  return theme.colors[color];
}

export function getThemeFont(font: keyof ThemeFonts): string {
  return theme.fonts[font];
}