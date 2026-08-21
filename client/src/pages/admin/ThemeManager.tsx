// ============================================
// THEME MANAGER
// Customize website appearance
// ============================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw } from 'lucide-react';
import axios from 'axios';

interface ThemeColors {
  primary: string;
  accent: string;
  background: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
}

interface Typography {
  fontFamily: string;
  headingFont: string;
  fontSize: number;
}

interface Theme {
  colors: ThemeColors;
  typography: Typography;
  borderRadius: number;
  glassEffect: boolean;
  buttonStyle: string;
  animationSpeed: number;
  themePreset: string;
}

const DEFAULT_THEME: Theme = {
  colors: {
    primary: '#3b82f6',
    accent: '#10b981',
    background: '#0a0a0a',
    cardBackground: '#111111',
    textPrimary: '#ffffff',
    textSecondary: '#a3a3a3',
  },
  typography: {
    fontFamily: 'Inter',
    headingFont: 'Inter',
    fontSize: 16,
  },
  borderRadius: 12,
  glassEffect: true,
  buttonStyle: 'solid',
  animationSpeed: 1,
  themePreset: 'dark',
};

const API_URL = 'http://localhost:5000/api';

const ThemeManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  // ============================================
  // FETCH THEME ON MOUNT
  // ============================================

  useEffect(() => {
    let mounted = true;

    const loadTheme = async () => {
      try {
        const response = await axios.get(`${API_URL}/theme`);

        if (mounted && response.data?.data) {
          setTheme({
            ...DEFAULT_THEME,
            ...response.data.data,
            colors: {
              ...DEFAULT_THEME.colors,
              ...response.data.data.colors,
            },
            typography: {
              ...DEFAULT_THEME.typography,
              ...response.data.data.typography,
            },
          });
        }
      } catch (error) {
        console.error('Failed to fetch theme:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadTheme();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================
  // SAVE THEME
  // ============================================

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const token = localStorage.getItem('token');

      await axios.put(`${API_URL}/theme`, theme, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save theme:', error);
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // RESET THEME
  // ============================================

  const handleReset = async () => {
    if (!window.confirm('Reset theme to defaults?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        `${API_URL}/theme/reset`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch the newly reset theme directly.
      const response = await axios.get(`${API_URL}/theme`);

      if (response.data?.data) {
        setTheme({
          ...DEFAULT_THEME,
          ...response.data.data,
          colors: {
            ...DEFAULT_THEME.colors,
            ...response.data.data.colors,
          },
          typography: {
            ...DEFAULT_THEME.typography,
            ...response.data.data.typography,
          },
        });
      } else {
        setTheme(DEFAULT_THEME);
      }
    } catch (error) {
      console.error('Failed to reset theme:', error);
    }
  };

  // ============================================
  // UPDATE COLOR
  // ============================================

  const updateColor = (
    key: keyof ThemeColors,
    value: string
  ) => {
    setTheme((previousTheme) => ({
      ...previousTheme,
      colors: {
        ...previousTheme.colors,
        [key]: value,
      },
    }));
  };

  // ============================================
  // UPDATE TYPOGRAPHY
  // ============================================

  const updateTypography = (
    key: keyof Typography,
    value: string | number
  ) => {
    setTheme((previousTheme) => ({
      ...previousTheme,
      typography: {
        ...previousTheme.typography,
        [key]: value,
      },
    }));
  };

  // ============================================
  // LOADING STATE
  // ============================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* ============================================
          HEADER
      ============================================ */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Theme Manager
          </h2>

          <p className="text-gray-400">
            Customize website appearance
          </p>
        </div>

        <div className="flex gap-2">
          {/* Reset */}
          <motion.button
            type="button"
            onClick={handleReset}
            disabled={saving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </motion.button>

          {/* Save */}
          <motion.button
            type="button"
            onClick={handleSave}
            disabled={saving}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />

                Saving...
              </>
            ) : saved ? (
              'Saved!'
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Theme
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* ============================================
          COLORS
      ============================================ */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">
          Colors
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {(
            Object.entries(theme.colors) as [
              keyof ThemeColors,
              string
            ][]
          ).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm text-gray-400 mb-2 capitalize">
                {key
                  .replace(/([A-Z])/g, ' $1')
                  .trim()}
              </label>

              <div className="flex items-center gap-2">
                {/* Color picker */}
                <input
                  type="color"
                  value={value}
                  onChange={(e) =>
                    updateColor(key, e.target.value)
                  }
                  className="w-10 h-10 rounded cursor-pointer bg-gray-800"
                  aria-label={`${key} color`}
                />

                {/* Hex value */}
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    updateColor(key, e.target.value)
                  }
                  className="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================
          TYPOGRAPHY
      ============================================ */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">
          Typography
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Font Family */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Font Family
            </label>

            <select
              value={theme.typography.fontFamily}
              onChange={(e) =>
                updateTypography(
                  'fontFamily',
                  e.target.value
                )
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">
                Montserrat
              </option>
              <option value="system-ui">
                System UI
              </option>
            </select>
          </div>

          {/* Heading Font */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Heading Font
            </label>

            <select
              value={theme.typography.headingFont}
              onChange={(e) =>
                updateTypography(
                  'headingFont',
                  e.target.value
                )
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Poppins">Poppins</option>
              <option value="Montserrat">
                Montserrat
              </option>
              <option value="system-ui">
                System UI
              </option>
            </select>
          </div>

          {/* Font Size */}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-400 mb-2">
              Font Size: {theme.typography.fontSize}px
            </label>

            <input
              type="range"
              min="12"
              max="24"
              value={theme.typography.fontSize}
              onChange={(e) =>
                updateTypography(
                  'fontSize',
                  Number(e.target.value)
                )
              }
              className="w-full accent-green-500"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>12px</span>
              <span>18px</span>
              <span>24px</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          SETTINGS
      ============================================ */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">
          Settings
        </h3>

        <div className="space-y-6">
          {/* Border Radius */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Border Radius: {theme.borderRadius}px
            </label>

            <input
              type="range"
              min="0"
              max="32"
              value={theme.borderRadius}
              onChange={(e) =>
                setTheme((previousTheme) => ({
                  ...previousTheme,
                  borderRadius: Number(e.target.value),
                }))
              }
              className="w-full accent-green-500"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0px</span>
              <span>16px</span>
              <span>32px</span>
            </div>
          </div>

          {/* Animation Speed */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Animation Speed: {theme.animationSpeed}x
            </label>

            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={theme.animationSpeed}
              onChange={(e) =>
                setTheme((previousTheme) => ({
                  ...previousTheme,
                  animationSpeed: Number(e.target.value),
                }))
              }
              className="w-full accent-green-500"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0.5x</span>
              <span>1.5x</span>
              <span>3x</span>
            </div>
          </div>

          {/* Theme Preset */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Theme Preset
            </label>

            <select
              value={theme.themePreset}
              onChange={(e) =>
                setTheme((previousTheme) => ({
                  ...previousTheme,
                  themePreset: e.target.value,
                }))
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="midnight">Midnight</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Button Style */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Button Style
            </label>

            <select
              value={theme.buttonStyle}
              onChange={(e) =>
                setTheme((previousTheme) => ({
                  ...previousTheme,
                  buttonStyle: e.target.value,
                }))
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="solid">Solid</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
              <option value="gradient">Gradient</option>
            </select>
          </div>

          {/* Glass Effect */}
          <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={theme.glassEffect}
              onChange={(e) =>
                setTheme((previousTheme) => ({
                  ...previousTheme,
                  glassEffect: e.target.checked,
                }))
              }
              className="w-4 h-4 accent-green-500"
            />

            <span>Glass Effect</span>
          </label>
        </div>
      </div>

      {/* ============================================
          PREVIEW
      ============================================ */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">
          Preview
        </h3>

        <div
          className="p-6 border"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.primary,
            borderRadius: `${theme.borderRadius}px`,
          }}
        >
          <h4
            className="text-xl font-bold mb-2"
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.headingFont,
            }}
          >
            Theme Preview
          </h4>

          <p
            className="mb-4"
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.fontFamily,
              fontSize: `${theme.typography.fontSize}px`,
            }}
          >
            This is how your customized theme will look.
          </p>

          <button
            type="button"
            className="px-4 py-2 text-white font-semibold"
            style={{
              backgroundColor: theme.colors.primary,
              borderRadius: `${theme.borderRadius}px`,
            }}
          >
            Preview Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeManager;