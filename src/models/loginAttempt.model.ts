// models/loginAttempt.model.ts
import mongoose, { Schema, Model } from "mongoose";

export interface ILoginAttempt {
  key: string; // IP or email
  count: number;
  resetAt: Date;
}

const loginAttemptSchema = new Schema<ILoginAttempt>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  resetAt: { type: Date, required: true },
});

// Auto-delete expired docs — MongoDB TTL index
loginAttemptSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

export const LoginAttempt: Model<ILoginAttempt> =
  mongoose.models.LoginAttempt ||
  mongoose.model<ILoginAttempt>("LoginAttempt", loginAttemptSchema);