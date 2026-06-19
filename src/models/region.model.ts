import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export interface IRegion
  extends Document {
  name: string;
  code: string;
  isActive: boolean;
  thumbnailUrl?: string
}

const RegionSchema =
  new Schema<IRegion>(
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

const Region: Model<IRegion> =
  mongoose.models.Region ||
  mongoose.model<IRegion>(
    "Region",
    RegionSchema
  );

export default Region;