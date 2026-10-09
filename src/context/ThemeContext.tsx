import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ColorVisionMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'high-contrast';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  colorVisionMode: ColorVisionMode;
  setColorVisionMode: (mode: ColorVisionMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const resolveTheme = (t: Theme): 'light' | 'dark' => {
  if (t === 'dark') return 'dark';
  if (t === 'light') return 'light';
  return getSystemTheme();
};

const applyThemeToDOM = (resolved: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;
  const isDark = resolved === 'dark';
  if (isDark) {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
};

const applyColorVisionToDOM = (mode: ColorVisionMode) => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia', 'cb-high-contrast', 'high-contrast');

  if (mode === 'protanopia') {
    root.classList.add('cb-protanopia');
  } else if (mode === 'deuteranopia') {
    root.classList.add('cb-deuteranopia');
  } else if (mode === 'tritanopia') {
    root.classList.add('cb-tritanopia');
  } else if (mode === 'high-contrast') {
    root.classList.add('cb-high-contrast', 'high-contrast');
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem('sevaguide_theme') as Theme;
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document !== 'undefined') {
      if (document.documentElement.classList.contains('dark')) {
        return 'dark';
      }
    }
    try {
      const saved = localStorage.getItem('sevaguide_theme') as Theme;
      if (saved === 'dark') return 'dark';
      if (saved === 'light') return 'light';
    } catch {
      // ignore
    }
    return getSystemTheme();
  });

  const [colorVisionMode, setColorVisionModeState] = useState<ColorVisionMode>(() => {
    try {
      const saved = localStorage.getItem('sevaguide_color_vision_mode') as ColorVisionMode;
      if (
        saved === 'none' ||
        saved === 'protanopia' ||
        saved === 'deuteranopia' ||
        saved === 'tritanopia' ||
        saved === 'high-contrast'
      ) {
        return saved;
      }
      // Migration fallback from legacy high-contrast check
      const legacyContrast = localStorage.getItem('sevaguide_high_contrast') === 'true';
      if (legacyContrast) return 'high-contrast';
    } catch {
      // ignore
    }
    return 'none';
  });

  const setColorVisionMode = (newMode: ColorVisionMode) => {
    setColorVisionModeState(newMode);
    applyColorVisionToDOM(newMode);
    try {
      localStorage.setItem('sevaguide_color_vision_mode', newMode);
      if (newMode === 'high-contrast') {
        localStorage.setItem('sevaguide_high_contrast', 'true');
      } else {
        localStorage.removeItem('sevaguide_high_contrast');
      }
    } catch {
      // ignore
    }
  };

  // Apply theme immediately to DOM, state, and localStorage
  const setTheme = (newTheme: Theme) => {
    const resolved = resolveTheme(newTheme);
    setThemeState(newTheme);
    setResolvedTheme(resolved);
    applyThemeToDOM(resolved);
    try {
      localStorage.setItem('sevaguide_theme', newTheme);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    const isCurrentlyDark =
      (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) ||
      resolvedTheme === 'dark';
    const nextTheme: Theme = isCurrentlyDark ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  useEffect(() => {
    const currentResolved = resolveTheme(theme);
    setResolvedTheme(currentResolved);
    applyThemeToDOM(currentResolved);
    applyColorVisionToDOM(colorVisionMode);

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const updated = getSystemTheme();
        setResolvedTheme(updated);
        applyThemeToDOM(updated);
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    return undefined;
  }, [theme, colorVisionMode]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
        colorVisionMode,
        setColorVisionMode
      }}
    >
      {/* Global SVG Color Vision feColorMatrix Filters */}
      <svg style={{ display: 'none', position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          {/* Protanopia (Red-blind / Red-weak) */}
          <filter id="protanopia-filter" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.56667 0.43333 0.00000 0 0
                      0.55833 0.44167 0.00000 0 0
                      0.00000 0.24167 0.75833 0 0
                      0       0       0       1 0"
            />
          </filter>
          {/* Deuteranopia (Green-blind / Green-weak) */}
          <filter id="deuteranopia-filter" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.62500 0.37500 0.00000 0 0
                      0.70000 0.30000 0.00000 0 0
                      0.00000 0.30000 0.70000 0 0
                      0       0       0       1 0"
            />
          </filter>
          {/* Tritanopia (Blue-yellow blind / Blue-weak) */}
          <filter id="tritanopia-filter" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="0.95000 0.05000 0.00000 0 0
                      0.00000 0.43333 0.56667 0 0
                      0.00000 0.47500 0.52500 0 0
                      0       0       0       1 0"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
