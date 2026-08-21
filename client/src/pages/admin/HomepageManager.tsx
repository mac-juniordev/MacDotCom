// ============================================
// HOMEPAGE MANAGER
// Edit homepage content dynamically
// ============================================

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, RotateCcw } from 'lucide-react';
import axios from 'axios';

interface CTA {
  text: string;
  url: string;
}

interface Hero {
  badge: string;
  title: string;
  subtitle: string;
  primaryCta: CTA;
  secondaryCta: CTA;
}

interface VisualSettings {
  backgroundPreset: string;
  floatingTechPreset: string;
  gradientPreset: string;
  glowIntensity: number;
  animationSpeed: number;
  particleDensity: number;
  gridVisibility: boolean;
  lightBeamEffects: boolean;
  blurIntensity: number;
  mouseSpotlight: boolean;
  marqueeText: string;
}

interface HomepageData {
  hero: Hero;
  tagline: string;
  visualSettings: VisualSettings;
}

const DEFAULT_FORM_DATA: HomepageData = {
  hero: {
    badge: '',
    title: '',
    subtitle: '',
    primaryCta: {
      text: '',
      url: '',
    },
    secondaryCta: {
      text: '',
      url: '',
    },
  },
  tagline: '',
  visualSettings: {
    backgroundPreset: 'default',
    floatingTechPreset: 'default',
    gradientPreset: 'blue',
    glowIntensity: 50,
    animationSpeed: 1,
    particleDensity: 30,
    gridVisibility: true,
    lightBeamEffects: true,
    blurIntensity: 10,
    mouseSpotlight: true,
    marqueeText: '',
  },
};

const API_URL = 'http://localhost:5000/api';

const HomepageManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState<HomepageData>(DEFAULT_FORM_DATA);

  // ============================================
  // FETCH HOMEPAGE
  // ============================================

  useEffect(() => {
    let mounted = true;

    const loadHomepage = async () => {
      try {
        const response = await axios.get(`${API_URL}/homepage`);

        if (!mounted) return;

        if (response.data?.data) {
          setFormData({
            ...DEFAULT_FORM_DATA,
            ...response.data.data,
            hero: {
              ...DEFAULT_FORM_DATA.hero,
              ...response.data.data.hero,
              primaryCta: {
                ...DEFAULT_FORM_DATA.hero.primaryCta,
                ...response.data.data.hero?.primaryCta,
              },
              secondaryCta: {
                ...DEFAULT_FORM_DATA.hero.secondaryCta,
                ...response.data.data.hero?.secondaryCta,
              },
            },
            visualSettings: {
              ...DEFAULT_FORM_DATA.visualSettings,
              ...response.data.data.visualSettings,
            },
          });
        }
      } catch (error) {
        console.error('Failed to fetch homepage:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadHomepage();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================
  // HANDLE SAVE
  // ============================================

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const token = localStorage.getItem('token');

      await axios.put(`${API_URL}/homepage`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSaved(true);

      window.setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (error) {
      console.error('Failed to save homepage:', error);
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // HANDLE RESET
  // ============================================

  const handleReset = async () => {
    if (!window.confirm('Reset homepage to defaults?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.put(
        `${API_URL}/homepage`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch the updated homepage directly here.
      const response = await axios.get(`${API_URL}/homepage`);

      if (response.data?.data) {
        setFormData({
          ...DEFAULT_FORM_DATA,
          ...response.data.data,
          hero: {
            ...DEFAULT_FORM_DATA.hero,
            ...response.data.data.hero,
            primaryCta: {
              ...DEFAULT_FORM_DATA.hero.primaryCta,
              ...response.data.data.hero?.primaryCta,
            },
            secondaryCta: {
              ...DEFAULT_FORM_DATA.hero.secondaryCta,
              ...response.data.data.hero?.secondaryCta,
            },
          },
          visualSettings: {
            ...DEFAULT_FORM_DATA.visualSettings,
            ...response.data.data.visualSettings,
          },
        });
      }
    } catch (error) {
      console.error('Failed to reset homepage:', error);
    }
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
      {/* ========================================
          HEADER
      ======================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Homepage Manager
          </h2>

          <p className="text-gray-400">
            Edit homepage content
          </p>
        </div>

        <div className="flex gap-2">
          {/* Reset */}
          <motion.button
            type="button"
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg flex items-center gap-2"
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
            className="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : saved ? (
              'Saved!'
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* ========================================
          HERO SECTION
      ======================================== */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">
          Hero Section
        </h3>

        <div className="space-y-4">
          {/* Badge */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Badge
            </label>

            <input
              type="text"
              value={formData.hero.badge}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    badge: e.target.value,
                  },
                }))
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Title
            </label>

            <input
              type="text"
              value={formData.hero.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    title: e.target.value,
                  },
                }))
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Subtitle
            </label>

            <textarea
              value={formData.hero.subtitle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  hero: {
                    ...prev.hero,
                    subtitle: e.target.value,
                  },
                }))
              }
              rows={3}
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Primary CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Primary Button Text
              </label>

              <input
                type="text"
                value={formData.hero.primaryCta.text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      primaryCta: {
                        ...prev.hero.primaryCta,
                        text: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Primary Button URL
              </label>

              <input
                type="text"
                value={formData.hero.primaryCta.url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      primaryCta: {
                        ...prev.hero.primaryCta,
                        url: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Secondary CTA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Secondary Button Text
              </label>

              <input
                type="text"
                value={formData.hero.secondaryCta.text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      secondaryCta: {
                        ...prev.hero.secondaryCta,
                        text: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Secondary Button URL
              </label>

              <input
                type="text"
                value={formData.hero.secondaryCta.url}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hero: {
                      ...prev.hero,
                      secondaryCta: {
                        ...prev.hero.secondaryCta,
                        url: e.target.value,
                      },
                    },
                  }))
                }
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================
          TAGLINE
      ======================================== */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">
          Company Tagline
        </h3>

        <input
          type="text"
          value={formData.tagline}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              tagline: e.target.value,
            }))
          }
          className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* ========================================
          VISUAL SETTINGS
      ======================================== */}

      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-lg font-bold text-white mb-4">
          Visual Settings
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Background */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Background Preset
            </label>

            <select
              value={formData.visualSettings.backgroundPreset}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visualSettings: {
                    ...prev.visualSettings,
                    backgroundPreset: e.target.value,
                  },
                }))
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="default">Default</option>
              <option value="minimal">Minimal</option>
              <option value="particles">Particles</option>
              <option value="gradient">Gradient</option>
              <option value="grid">Grid</option>
            </select>
          </div>

          {/* Floating Tech */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Floating Tech Preset
            </label>

            <select
              value={formData.visualSettings.floatingTechPreset}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visualSettings: {
                    ...prev.visualSettings,
                    floatingTechPreset: e.target.value,
                  },
                }))
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="default">Default</option>
              <option value="minimal">Minimal</option>
              <option value="dense">Dense</option>
              <option value="none">None</option>
            </select>
          </div>

          {/* Gradient */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Gradient Preset
            </label>

            <select
              value={formData.visualSettings.gradientPreset}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visualSettings: {
                    ...prev.visualSettings,
                    gradientPreset: e.target.value,
                  },
                }))
              }
              className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="blue">Blue</option>
              <option value="green">Green</option>
              <option value="purple">Purple</option>
              <option value="orange">Orange</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Blur */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Blur Intensity: {formData.visualSettings.blurIntensity}
            </label>

            <input
              type="range"
              min="0"
              max="50"
              value={formData.visualSettings.blurIntensity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visualSettings: {
                    ...prev.visualSettings,
                    blurIntensity: Number(e.target.value),
                  },
                }))
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="mt-6 space-y-5">
          {/* Glow */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Glow Intensity:{' '}
              {formData.visualSettings.glowIntensity}%
            </label>

            <input
              type="range"
              min="0"
              max="100"
              value={formData.visualSettings.glowIntensity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visualSettings: {
                    ...prev.visualSettings,
                    glowIntensity: Number(e.target.value),
                  },
                }))
              }
              className="w-full"
            />
          </div>

          {/* Animation Speed */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Animation Speed:{' '}
              {formData.visualSettings.animationSpeed}x
            </label>

            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={formData.visualSettings.animationSpeed}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visualSettings: {
                    ...prev.visualSettings,
                    animationSpeed: Number(e.target.value),
                  },
                }))
              }
              className="w-full"
            />
          </div>

          {/* Particle Density */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Particle Density:{' '}
              {formData.visualSettings.particleDensity}%
            </label>

            <input
              type="range"
              min="0"
              max="100"
              value={formData.visualSettings.particleDensity}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visualSettings: {
                    ...prev.visualSettings,
                    particleDensity: Number(e.target.value),
                  },
                }))
              }
              className="w-full"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Grid */}
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={formData.visualSettings.gridVisibility}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visualSettings: {
                    ...prev.visualSettings,
                    gridVisibility: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 accent-green-500"
            />

            Grid Visibility
          </label>

          {/* Light beams */}
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={formData.visualSettings.lightBeamEffects}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visualSettings: {
                    ...prev.visualSettings,
                    lightBeamEffects: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 accent-green-500"
            />

            Light Beam Effects
          </label>

          {/* Mouse spotlight */}
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={formData.visualSettings.mouseSpotlight}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visualSettings: {
                    ...prev.visualSettings,
                    mouseSpotlight: e.target.checked,
                  },
                }))
              }
              className="w-4 h-4 accent-green-500"
            />

            Mouse Spotlight
          </label>
        </div>

        {/* Marquee */}
        <div className="mt-6">
          <label className="block text-sm text-gray-400 mb-2">
            Marquee Text
          </label>

          <input
            type="text"
            value={formData.visualSettings.marqueeText}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                visualSettings: {
                  ...prev.visualSettings,
                  marqueeText: e.target.value,
                },
              }))
            }
            placeholder="Your marquee text..."
            className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </div>
  );
};

export default HomepageManager;