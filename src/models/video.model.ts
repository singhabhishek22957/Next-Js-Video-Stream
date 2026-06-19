import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IVideo extends Document {
  title: string;
  slug: string;
  lessonId?: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl: string;
  previewVideoUrl?: string;
  duration?: number;
  uploader?: Types.ObjectId;

  actors: string[];

  genre: Types.ObjectId[];

  region: Types.ObjectId;

  language: Types.ObjectId;

  views: number;
  likes: number;

  status: "unlisted" | "published";

  tags: string[];

  isDeleted: boolean;
  deletedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    lessonId: {
      type: String,
    },

    description: {
      type: String,
    },

    videoUrl: {
      type: String,
      required: true,
    },

    thumbnailUrl: {
      type: String,
      default: "/uploads/default-thumbnail.jpg",
    },

    previewVideoUrl: {
      type: String,
    },

    duration: {
      type: Number,
    },

    uploader: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    actors: [
      {
        type: String,
      },
    ],

    genre: [
      {
        type: Schema.Types.ObjectId,
        ref: "Genre",
      },
    ],

    region: {
      type: Schema.Types.ObjectId,
      ref: "Region",
    },

    language: {
      type: Schema.Types.ObjectId,
      ref: "Language",
    },

    views: {
      type: Number,
      default: 0,
    },

    likes: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["unlisted", "published"],
      default: "published",
    },

    tags: [String],

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Video: Model<IVideo> =
  mongoose.models.Video || mongoose.model<IVideo>("Video", videoSchema);
