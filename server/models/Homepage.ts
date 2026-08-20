// ============================================
// HOMEPAGE MODEL
// Controls all homepage content dynamically
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Homepage document
export interface IHomepage extends Document {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCta: {
      text: string;
      url: string;
    };
    secondaryCta: {
      text: string;
      url: string;
    };
  };
  tagline: string;
  featuredProject: mongoose.Types.ObjectId | null;
  featuredProduct: mongoose.Types.ObjectId | null;
  visualSettings: {
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
  };
}

// Homepage Schema
const homepageSchema = new Schema<IHomepage>(
  {
    hero: {
      badge: {
        type: String,
        default: 'Available for new projects',
        maxlength: [100, 'Badge cannot exceed 100 characters'],
      },
      title: {
        type: String,
        default: 'Building Digital Experiences',
        required: [true, 'Hero title is required'],
        maxlength: [200, 'Title cannot exceed 200 characters'],
      },
      subtitle: {
        type: String,
        default: 'We create software solutions that transform businesses',
        required: [true, 'Hero subtitle is required'],
        maxlength: [500, 'Subtitle cannot exceed 500 characters'],
      },
      primaryCta: {
        text: {
          type: String,
          default: 'View Projects',
          maxlength: [50, 'Button text cannot exceed 50 characters'],
        },
        url: {
          type: String,
          default: '/projects',
        },
      },
      secondaryCta: {
        text: {
          type: String,
          default: 'Contact Us',
          maxlength: [50, 'Button text cannot exceed 50 characters'],
        },
        url: {
          type: String,
          default: '/contact',
        },
      },
    },
    tagline: {
      type: String,
      default: 'Creating Software Solutions',
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
    },
    featuredProject: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    featuredProduct: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    visualSettings: {
      backgroundPreset: {
        type: String,
        enum: ['default', 'minimal', 'particles', 'gradient', 'grid'],
        default: 'default',
      },
      floatingTechPreset: {
        type: String,
        enum: ['default', 'minimal', 'extensive', 'none'],
        default: 'default',
      },
      gradientPreset: {
        type: String,
        enum: ['blue', 'green', 'purple', 'orange', 'custom'],
        default: 'blue',
      },
      glowIntensity: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
      },
      animationSpeed: {
        type: Number,
        min: 0.5,
        max: 3,
        default: 1,
      },
      particleDensity: {
        type: Number,
        min: 0,
        max: 100,
        default: 30,
      },
      gridVisibility: {
        type: Boolean,
        default: true,
      },
      lightBeamEffects: {
        type: Boolean,
        default: true,
      },
      blurIntensity: {
        type: Number,
        min: 0,
        max: 20,
        default: 10,
      },
      mouseSpotlight: {
        type: Boolean,
        default: true,
      },
      marqueeText: {
        type: String,
        default: 'React • TypeScript • Node.js • MongoDB • Express • Tailwind CSS',
        maxlength: [200, 'Marquee text cannot exceed 200 characters'],
      },
    },
  },
  {
    timestamps: true,
  }
);

const Homepage = mongoose.model<IHomepage>('Homepage', homepageSchema);
export default Homepage;