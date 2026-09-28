import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productName: {
      type: String,
      required: [true, 'Product or document name is required'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Other',
      trim: true,
    },
    vendor: {
      type: String,
      trim: true,
      default: '',
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    warrantyPeriodMonths: {
      type: Number,
      default: 12,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiration date is required'],
      index: true,
    },
    price: {
      type: Number,
      default: 0,
    },
    serialNumber: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    documentUrl: {
      type: String,
      default: '',
    },
    documentPublicId: {
      type: String,
      default: '',
    },
    documentType: {
      type: String,
      default: 'image/jpeg',
    },
    extractedRaw: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'expiring_soon', 'expired'],
      default: 'active',
      index: true,
    },
    reminderPreferences: {
      daysBefore: {
        type: [Number],
        default: [30, 15, 7, 1],
      },
      channels: {
        type: [String],
        default: ['email'],
      },
    },
    reminderDays: {
      type: [Number],
      default: [30, 15, 7, 1],
    },
    reminderHistory: [
      {
        date: { type: String },
        channel: { type: String, default: 'Email' },
        message: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound indexes for optimal querying
itemSchema.index({ user: 1, expiryDate: 1 });
itemSchema.index({ user: 1, status: 1 });
itemSchema.index({ user: 1, category: 1 });

export const Item = mongoose.model('Item', itemSchema);
export default Item;
