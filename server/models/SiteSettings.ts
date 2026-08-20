// ============================================
// SITE SETTINGS MODEL
// General website settings
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

// Interface for SiteSettings document
export interface ISiteSettings extends Document {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo: string;
  favicon: string;
  contactEmail: string;
  phone: string;
  address: string;
  resumeUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// SiteSettings Schema
const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    siteName: {
      type: String,
      default: 'MacDotCom',
      required: [true, 'Site name is required'],
      maxlength: [50, 'Site name cannot exceed 50 characters'],
    },
    siteDescription: {
      type: String,
      default: 'Building Digital Experiences. Creating Software Solutions.',
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    siteUrl: {
      type: String,
      default: 'https://macdotcom.com',
    },
    logo: {
      type: String,
      default: null,
    },
    favicon: {
      type: String,
      default: null,
    },
    contactEmail: {
      type: String,
      default: 'hello@macdotcom.com',
    },
    phone: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: null,
    },
    resumeUrl: {
      type: String,
      default: null,
    },
    socialLinks: {
      github: {
        type: String,
        default: 'https://github.com/mac-juniordev',
      },
      linkedin: {
        type: String,
        default: null,
      },
      twitter: {
        type: String,
        default: null,
      },
      instagram: {
        type: String,
        default: null,
      },
    },
    seo: {
      title: {
        type: String,
        default: 'MacDotCom - Software Company',
      },
      description: {
        type: String,
        default: 'Building Digital Experiences. Creating Software Solutions.',
      },
      keywords: {
        type: [String],
        default: ['software', 'development', 'web', 'mobile', 'MacDotCom'],
      },
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', siteSettingsSchema);
export default SiteSettings;