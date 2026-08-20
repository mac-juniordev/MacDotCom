// ============================================
// THEME SETTINGS MODEL
// Controls website appearance
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

// Interface for ThemeSettings document
export interface IThemeSettings extends Document {
  colors: {
    primary: string;
    accent: string;
    background: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    fontSize: number;
  };
  borderRadius: number;
  glassEffect: boolean;
  buttonStyle: string;
  animationSpeed: number;
  themePreset: string;
}

// ThemeSettings Schema
const themeSettingsSchema = new Schema<IThemeSettings>(
  {
    colors: {
      primary: {
        type: String,
        default: '#3B82F6',
      },
      accent: {
        type: String,
        default: '#10B981',
      },
      background: {
        type: String,
        default: '#0A0A0A',
      },
      cardBackground: {
        type: String,
        default: '#111111',
      },
      textPrimary: {
        type: String,
        default: '#FFFFFF',
      },
      textSecondary: {
        type: String,
        default: '#A3A3A3',
      },
    },
    typography: {
      fontFamily: {
        type: String,
        default: 'Inter',
      },
      headingFont: {
        type: String,
        default: 'Inter',
      },
      fontSize: {
        type: Number,
        default: 16,
        min: 12,
        max: 24,
      },
    },
    borderRadius: {
      type: Number,
      default: 12,
      min: 0,
      max: 32,
    },
    glassEffect: {
      type: Boolean,
      default: true,
    },
    buttonStyle: {
      type: String,
      enum: ['solid', 'outline', 'glass', 'gradient'],
      default: 'solid',
    },
    animationSpeed: {
      type: Number,
      default: 1,
      min: 0.5,
      max: 3,
    },
    themePreset: {
      type: String,
      enum: ['dark', 'light', 'system'],
      default: 'dark',
    },
  },
  {
    timestamps: true,
  }
);

const ThemeSettings = mongoose.model<IThemeSettings>('ThemeSettings', themeSettingsSchema);
export default ThemeSettings;