// ============================================
// TESTIMONIAL MODEL
// Represents client/customer testimonials
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Testimonial document
export interface ITestimonial extends Document {
  name: string;
  role: string;
  company?: string;
  content: string;
  avatar?: string;
  rating: number;
  order: number;
  isVisible: boolean;
}

// Testimonial Schema
const testimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role cannot exceed 100 characters'],
    },
    company: {
      type: String,
      default: null,
      trim: true,
      maxlength: [100, 'Company cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Testimonial content is required'],
      maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    avatar: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: 5,
      min: [1, 'Rating cannot be less than 1'],
      max: [5, 'Rating cannot exceed 5'],
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

const Testimonial = mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
export default Testimonial;