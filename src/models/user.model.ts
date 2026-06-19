import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  active: boolean;
  isDeleted: boolean;
  online: boolean;
  lastSeen?: Date;
  failedLoginAttempts: number;
  isLocked: boolean;
  lockUntil?: Date;
  createdBy?: mongoose.Types.ObjectId;

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    online: {
      type: Boolean,
      default: false,
    },

    lastSeen: {
      type: Date,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Password Hashing
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// Compare Password
userSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, this.password);

  if (!isMatch) {
    this.failedLoginAttempts += 1;

    if (this.failedLoginAttempts >= 5) {
      this.isLocked = true;

      // Lock for 30 minutes
      this.lockUntil = new Date(Date.now() + 30 * 60 * 1000);
    }

    await this.save();
  }
  return isMatch;
};

// Generate Access Token

// Generate Refresh Token

export  const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
