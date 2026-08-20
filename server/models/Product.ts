// ============================================
// PRODUCT MODEL
// Represents software products
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

// ============================================
// INTERFACE FOR PRODUCT DOCUMENT
// ============================================

export interface IProduct extends Document {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo: string;
  screenshots: string[];
  features: string[];
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
  status: 'development' | 'beta' | 'launched' | 'maintenance';
  featured: boolean;
  order: number;
  views: number;
}

// ============================================
// PRODUCT SCHEMA
// ============================================

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    tagline: {
      type: String,
      required: [true, 'Product tagline is required'],
      maxlength: [200, 'Tagline cannot exceed 200 characters'],
    },

    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    logo: {
      type: String,
      required: [true, 'Product logo is required'],
    },

    screenshots: {
      type: [String],
      default: [],
    },

    features: {
      type: [String],
      default: [],
      validate: {
        validator: (features: string[]) => features.length > 0,
        message: 'At least one feature is required',
      },
    },

    technologies: {
      type: [String],
      required: [true, 'At least one technology is required'],
      validate: {
        validator: (technologies: string[]) => technologies.length > 0,
        message: 'At least one technology is required',
      },
    },

    githubUrl: {
      type: String,
      default: null,
    },

    demoUrl: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ['development', 'beta', 'launched', 'maintenance'],
      default: 'development',
    },

    featured: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
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

productSchema.pre('save', async function () {
  if (!this.isModified('name')) {
    return;
  }

  this.slug = this.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
});

// ============================================
// CREATE / EXPORT MODEL
// ============================================

const Product =
  mongoose.models.Product ||
  mongoose.model<IProduct>('Product', productSchema);

export default Product;