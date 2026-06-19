import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export interface IGenre
  extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  thumbnailUrl?: string;
}

const GenreSchema =
  new Schema<IGenre>(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      thumbnailUrl: {
        type: String,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },

      description: {
        type: String,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Genre: Model<IGenre> =
  mongoose.models.Genre ||
  mongoose.model<IGenre>(
    "Genre",
    GenreSchema
  );

export default Genre;