// ============================================
// TIMELINE MODEL
// Represents career/company milestones
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Timeline document
export interface ITimeline extends Document {
  year: string;
  title: string;
  description: string;
  type: 'education' | 'experience' | 'achievement' | 'milestone';
  icon?: string;
  order: number;
  isVisible: boolean;
}

// Timeline Schema
const timelineSchema = new Schema<ITimeline>(
  {
    year: {
      type: String,
      required: [true, 'Year is required'],
      trim: true,
      match: [/^\d{4}$/, 'Year must be 4 digits'],
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['education', 'experience', 'achievement', 'milestone'],
      default: 'milestone',
    },
    icon: {
      type: String,
      default: null,
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
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Create and export Timeline model
const Timeline = mongoose.model<ITimeline>('Timeline', timelineSchema);
export default Timeline;