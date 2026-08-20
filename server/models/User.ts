// ============================================
// USER MODEL
// Represents the owner (you)
// ============================================

import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// ============================================
// USER INTERFACE
// ============================================

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'owner' | 'admin';
  avatar?: string;
  title?: string;
  bio?: string;
  location?: string;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

// ============================================
// USER SCHEMA
// ============================================

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: ['owner', 'admin'],
      default: 'owner',
    },

    avatar: {
      type: String,
      default: null,
    },

    title: {
      type: String,
      default: 'Founder & CEO',
      trim: true,
    },

    bio: {
      type: String,
      default: '',
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },

    location: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// ============================================
// HASH PASSWORD BEFORE SAVE
// ============================================

userSchema.pre('save', async function () {
  // Only hash the password if it has been modified
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
});

// ============================================
// COMPARE PASSWORD
// ============================================

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// ============================================
// REMOVE SENSITIVE FIELDS FROM JSON
// ============================================

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const result = { ...ret } as {
      [key: string]: unknown;
    };

    delete result.password;
    delete result.__v;

    return result;
  },
});

// ============================================
// CREATE / EXPORT MODEL
// ============================================

const User =
  mongoose.models.User ||
  mongoose.model<IUser>('User', userSchema);

export default User;