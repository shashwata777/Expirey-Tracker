import mongoose from 'mongoose';

const reminderLogSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      index: true,
    },
    daysLeft: {
      type: Number,
      required: true,
    },
    channel: {
      type: String,
      default: 'email',
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    recipientEmail: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index on { item, daysLeft } to guarantee no duplicate sends even under concurrency/race conditions
reminderLogSchema.index({ item: 1, daysLeft: 1 }, { unique: true });

export const ReminderLog = mongoose.model('ReminderLog', reminderLogSchema);
export default ReminderLog;
