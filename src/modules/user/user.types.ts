import { UserTier } from "../../constants/userTier.constants";
import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  username: string,
  email: string;
  password: string;
  tier: UserTier;
  refreshToken?: string;
  resetPasswordToken?: string,
  resetPasswordExpires? : Date
  createdAt: Date;
  updatedAt: Date;
}
