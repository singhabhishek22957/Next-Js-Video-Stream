import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export interface ILanguage
  extends Document {
  name: string;
  code: string;
  isActive: boolean;
  thumbnailUrl?: string;
}

const LanguageSchema =
  new Schema<ILanguage>(
    {
      name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      thumbnailUrl: {
        type:String
      },

      code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
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

const Language: Model<ILanguage> =
  mongoose.models.Language ||
  mongoose.model<ILanguage>(
    "Language",
    LanguageSchema
  );

export default Language;