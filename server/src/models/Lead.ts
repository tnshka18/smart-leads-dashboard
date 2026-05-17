import mongoose, { Schema, Model } from 'mongoose';
import { ILeadDocument, LeadStatus, LeadSource } from '../types';

const leadSchema = new Schema<ILeadDocument>(
  {
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(LeadStatus),
        message: 'Status must be one of: New, Contacted, Qualified, Lost',
      },
      default: LeadStatus.NEW,
    },
    source: {
      type: String,
      enum: {
        values: Object.values(LeadSource),
        message: 'Source must be one of: Website, Instagram, Referral',
      },
      required: [true, 'Lead source is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },
  },
  {
    timestamps: true,
    toJSON: {
  transform: (_doc, ret) => {
    const { __v, ...rest } = ret;
    return rest;
  },
},
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
leadSchema.index({ status: 1 });
leadSchema.index({ source: 1 });
leadSchema.index({ createdBy: 1 });
leadSchema.index({ createdAt: -1 });
leadSchema.index({ name: 'text', email: 'text' }); // Full-text search

const Lead: Model<ILeadDocument> = mongoose.model<ILeadDocument>('Lead', leadSchema);

export default Lead;
