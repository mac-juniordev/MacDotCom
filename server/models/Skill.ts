// ============================================
// SKILL MODEL
// Represents technical skills with proficiency
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Skill document
export interface ISkill extends Document {
  name: string;
  icon: string;
  category: string;
  proficiency: number;
  description?: string;
  order: number;
  isVisible: boolean;
}

// Skill Schema
const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    icon: {
      type: String,
      default: null,
    },
    category: {
      type: String,
      required: [true, 'Skill category is required'],
      enum: ['frontend', 'backend', 'database', 'devops', 'tools', 'languages', 'other'],
    },
    proficiency: {
      type: Number,
      required: [true, 'Proficiency is required'],
      min: [0, 'Proficiency cannot be less than 0'],
      max: [100, 'Proficiency cannot exceed 100'],
    },
    description: {
      type: String,
      default: '',
      maxlength: [300, 'Description cannot exceed 300 characters'],
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

const Skill = mongoose.model<ISkill>('Skill', skillSchema);
export default Skill;