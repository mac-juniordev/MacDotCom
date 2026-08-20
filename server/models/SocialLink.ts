// ============================================
// SOCIAL LINK MODEL
// Represents social media and contact links
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

// Interface for SocialLink document
export interface ISocialLink extends Document {
  platform: string;
  url: string;
  icon: string;
  label?: string;
  order: number;
  isVisible: boolean;
}

// SocialLink Schema
const socialLinkSchema = new Schema<ISocialLink>(
  {
    platform: {
      type: String,
      required: [true, 'Platform name is required'],
      trim: true,
      maxlength: [50, 'Platform name cannot exceed 50 characters'],
    },
    url: {
      type: String,
      required: [true, 'URL is required'],
      trim: true,
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
      trim: true,
    },
    label: {
      type: String,
      default: null,
      maxlength: [100, 'Label cannot exceed 100 characters'],
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const SocialLink = mongoose.model<ISocialLink>('SocialLink', socialLinkSchema);
export default SocialLink;