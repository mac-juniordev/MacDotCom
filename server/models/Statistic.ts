// ============================================
// STATISTIC MODEL
// Represents company statistics
// ============================================

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Statistic document
export interface IStatistic extends Document {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  icon?: string;
  order: number;
  isVisible: boolean;
}

// Statistic Schema
const statisticSchema = new Schema<IStatistic>(
  {
    label: {
      type: String,
      required: [true, 'Label is required'],
      trim: true,
      maxlength: [100, 'Label cannot exceed 100 characters'],
    },
    value: {
      type: Number,
      required: [true, 'Value is required'],
      min: [0, 'Value cannot be negative'],
    },
    suffix: {
      type: String,
      default: '',
      maxlength: [10, 'Suffix cannot exceed 10 characters'],
    },
    prefix: {
      type: String,
      default: '',
      maxlength: [10, 'Prefix cannot exceed 10 characters'],
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
    timestamps: true,
  }
);

const Statistic = mongoose.model<IStatistic>('Statistic', statisticSchema);
export default Statistic;