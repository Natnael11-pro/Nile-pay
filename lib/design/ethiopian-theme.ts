// Ethiopian Design System for Nile Pay
// Inspired by Ethiopian flag colors, cultural patterns, and traditional aesthetics

export const ethiopianColors = {
  // Primary Ethiopian Flag Colors
  primary: {
    green: '#009639',      // Ethiopian flag green
    yellow: '#FFCD00',     // Ethiopian flag yellow  
    red: '#DA020E',        // Ethiopian flag red
    blue: '#0F47AF',       // Ethiopian flag blue (star background)
  },
  
  // Extended Ethiopian Palette
  secondary: {
    emerald: '#10B981',    // Highlands green
    gold: '#F59E0B',       // Ethiopian gold
    terracotta: '#DC2626', // Traditional pottery red
    sapphire: '#1E40AF',   // Blue Nile blue
    coffee: '#92400E',     // Ethiopian coffee brown
    ivory: '#FEF3C7',      // Traditional textile cream
  },
  
  // Neutral Ethiopian Tones
  neutral: {
    stone: '#78716C',      // Ethiopian stone
    sand: '#F5F5DC',       // Desert sand
    charcoal: '#374151',   // Traditional charcoal
    pearl: '#F9FAFB',      // Ethiopian pearl
    slate: '#64748B',      // Mountain slate
  },
  
  // Semantic Colors
  success: '#10B981',      // Green for success
  warning: '#F59E0B',      // Gold for warnings
  error: '#DC2626',        // Red for errors
  info: '#1E40AF',         // Blue for information
};

export const ethiopianGradients = {
  primary: 'linear-gradient(135deg, #009639 0%, #10B981 100%)',
  sunset: 'linear-gradient(135deg, #FFCD00 0%, #F59E0B 100%)',
  heritage: 'linear-gradient(135deg, #009639 0%, #FFCD00 50%, #DA020E 100%)',
  highlands: 'linear-gradient(135deg, #10B981 0%, #0F47AF 100%)',
  coffee: 'linear-gradient(135deg, #92400E 0%, #374151 100%)',
};

export const ethiopianShadows = {
  soft: '0 2px 8px rgba(0, 150, 57, 0.1)',
  medium: '0 4px 16px rgba(0, 150, 57, 0.15)',
  strong: '0 8px 32px rgba(0, 150, 57, 0.2)',
  glow: '0 0 20px rgba(0, 150, 57, 0.3)',
};

export const ethiopianTypography = {
  fontFamilies: {
    primary: '"Inter", "Segoe UI", system-ui, sans-serif',
    heading: '"IBM Plex Serif", Georgia, serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
};

export const ethiopianSpacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
};

export const ethiopianBorderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px',
};

// Ethiopian Cultural Patterns (CSS-in-JS)
export const ethiopianPatterns = {
  // Traditional Ethiopian cross pattern
  cross: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23009639' fill-opacity='0.05'%3E%3Cpath d='M20 20h20v20H20V20zm-20 0h20v20H0V20z'/%3E%3C/g%3E%3C/svg%3E")`,
  },
  
  // Geometric pattern inspired by Ethiopian textiles
  geometric: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FFCD00' fill-opacity='0.08'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 0l-15-15v30l15-15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  },
  
  // Subtle dot pattern
  dots: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23009639' fill-opacity='0.03'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
  },
};

// Ethiopian Component Styles
export const ethiopianComponents = {
  button: {
    primary: {
      background: ethiopianGradients.primary,
      color: 'white',
      border: 'none',
      borderRadius: ethiopianBorderRadius.lg,
      padding: `${ethiopianSpacing.md} ${ethiopianSpacing.xl}`,
      fontWeight: ethiopianTypography.weights.semibold,
      boxShadow: ethiopianShadows.medium,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: ethiopianShadows.strong,
        transform: 'translateY(-2px)',
      },
    },
    
    secondary: {
      background: 'white',
      color: ethiopianColors.primary.green,
      border: `2px solid ${ethiopianColors.primary.green}`,
      borderRadius: ethiopianBorderRadius.lg,
      padding: `${ethiopianSpacing.md} ${ethiopianSpacing.xl}`,
      fontWeight: ethiopianTypography.weights.semibold,
      transition: 'all 0.3s ease',
      '&:hover': {
        background: ethiopianColors.primary.green,
        color: 'white',
      },
    },
  },
  
  card: {
    primary: {
      background: 'white',
      borderRadius: ethiopianBorderRadius['2xl'],
      boxShadow: ethiopianShadows.soft,
      border: `1px solid ${ethiopianColors.neutral.sand}`,
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: ethiopianShadows.medium,
        transform: 'translateY(-4px)',
      },
    },
    
    featured: {
      background: ethiopianGradients.primary,
      color: 'white',
      borderRadius: ethiopianBorderRadius['2xl'],
      boxShadow: ethiopianShadows.strong,
      border: 'none',
      overflow: 'hidden',
    },
  },
  
  input: {
    primary: {
      border: `2px solid ${ethiopianColors.neutral.sand}`,
      borderRadius: ethiopianBorderRadius.lg,
      padding: ethiopianSpacing.md,
      fontSize: ethiopianTypography.sizes.base,
      transition: 'all 0.3s ease',
      '&:focus': {
        borderColor: ethiopianColors.primary.green,
        boxShadow: `0 0 0 3px ${ethiopianColors.primary.green}20`,
        outline: 'none',
      },
    },
  },
};

// Ethiopian Animation Presets
export const ethiopianAnimations = {
  fadeInUp: {
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  
  slideInRight: {
    from: { opacity: 0, transform: 'translateX(30px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  
  scaleIn: {
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  
  pulse: {
    '0%, 100%': { opacity: 1 },
    '50%': { opacity: 0.8 },
  },
};

// Ethiopian Cultural Icons (Unicode symbols)
export const ethiopianIcons = {
  star: '⭐', // Ethiopian flag star
  coffee: '☕', // Ethiopian coffee
  mountain: '⛰️', // Ethiopian highlands
  sun: '☀️', // Ethiopian sun
  grain: '🌾', // Ethiopian agriculture
  lion: '🦁', // Lion of Judah
  cross: '✚', // Ethiopian Orthodox cross
  crown: '👑', // Imperial crown
};

// Utility function to get Ethiopian color by name
export const getEthiopianColor = (colorPath: string): string => {
  const paths = colorPath.split('.');
  let color: any = ethiopianColors;
  
  for (const path of paths) {
    color = color[path];
    if (!color) return ethiopianColors.primary.green; // fallback
  }
  
  return color;
};

// Utility function to create Ethiopian-themed CSS variables
export const createEthiopianCSSVariables = () => {
  return {
    '--eth-primary-green': ethiopianColors.primary.green,
    '--eth-primary-yellow': ethiopianColors.primary.yellow,
    '--eth-primary-red': ethiopianColors.primary.red,
    '--eth-primary-blue': ethiopianColors.primary.blue,
    '--eth-gradient-primary': ethiopianGradients.primary,
    '--eth-gradient-heritage': ethiopianGradients.heritage,
    '--eth-shadow-soft': ethiopianShadows.soft,
    '--eth-shadow-medium': ethiopianShadows.medium,
    '--eth-border-radius-lg': ethiopianBorderRadius.lg,
    '--eth-border-radius-2xl': ethiopianBorderRadius['2xl'],
    '--eth-spacing-md': ethiopianSpacing.md,
    '--eth-spacing-lg': ethiopianSpacing.lg,
  };
};
