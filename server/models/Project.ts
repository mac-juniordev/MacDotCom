// ============================================
// PROJECT MODEL
// Represents portfolio projects
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// INTERFACE FOR PROJECT DOCUMENT
// ============================================

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  gallery: string[];
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: 'web' | 'mobile' | 'desktop' | 'api' | 'fullstack' | 'other';
  status: 'in-progress' | 'completed' | 'maintenance' | 'archived';
  featured: boolean;
  order: number;
  startDate: Date;
  endDate?: Date;
  views: number;
}

// ============================================
// PROJECT SCHEMA
// ============================================

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, 'Project description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    longDescription: {
      type: String,
      default: '',
    },

    thumbnail: {
      type: String,
      required: [true, 'Project thumbnail is required'],
    },

    gallery: {
      type: [String],
      default: [],
    },

    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
      validate: {
        validator: (techs: string[]) => techs.length > 0,
        message: 'At least one technology is required',
      },
    },

    githubUrl: {
      type: String,
      default: null,
    },

    liveUrl: {
      type: String,
      default: null,
    },

    category: {
      type: String,
      required: [true, 'Project category is required'],
      enum: ['web', 'mobile', 'desktop', 'api', 'fullstack', 'other'],
    },

    status: {
      type: String,
      enum: ['in-progress', 'completed', 'maintenance', 'archived'],
      default: 'completed',
    },

    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      default: null,
    },

    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// CREATE SLUG BEFORE SAVING
// ============================================

projectSchema.pre('save', async function () {
  if (!this.isModified('title')) {
    return;
  }

  this.slug = this.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
});

// ============================================
// CREATE / EXPORT MODEL
// ============================================

const Project =
  mongoose.models.Project ||
  mongoose.model<IProject>('Project', projectSchema);

export default Project;