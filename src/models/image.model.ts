
import mongoose, {
  Schema,
  models,
  model,
} from "mongoose";

const imageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    bunnyPath: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ImageModel =
  models.Image ||
  model("Image", imageSchema);

