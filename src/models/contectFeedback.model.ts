import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactFeedback extends Document {
  subject: string;
  email: string;
  message: string;
  status: "pending" | "queued" | "resolved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const contactFeedbackSchema = new Schema<IContactFeedback>(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["pending", "queued", "resolved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const ContactFeedback: Model<IContactFeedback> =
  mongoose.models.ContactFeedback ||
  mongoose.model<IContactFeedback>(
    "ContactFeedback",
    contactFeedbackSchema
  );