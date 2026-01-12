import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.types";
import { UserTier } from "../../constants/userTier.constants";

const userSchema = new Schema<IUser>(
  {
    username: {
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
    tier: {
      type: String,
      enum: Object.values(UserTier),
      default: UserTier.FREE,
    },
    refreshToken: { type: String },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);
