import { Request, Response } from "express";
import { forgotPasswordService, loginService, refreshTokenService, resetPasswordService, signupService } from "./auth.services";
import { loginSchema, signupSchema } from "./auth.validations";
import crypto from "crypto"
import { User } from "../user/user.model";
import z, { flattenError } from "zod";
// import { safeParse } from "zod";

export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const { newAccessToken, newRefreshToken } =
    await refreshTokenService(token);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  res.json({ accessToken: newAccessToken });
};


export const signup = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body);

    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error);
      return res.status(400).json({
        success: false,
        errors: fieldErrors,
    });
}

    const { name, email, password } = parsed.data;

    const { user, accessToken, refreshToken } =
      await signupService(name, email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    throw error;
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      const { fieldErrors } = z.flattenError(parsed.error);
      return res.status(400).json({
        success: false,
        errors: fieldErrors,
      });
    }

    const { email, password } = parsed.data;

    const { user, accessToken, refreshToken } =
      await loginService(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      accessToken,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    throw error;
  }
};


export const logout = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const hashed = crypto.createHash("sha256").update(token).digest("hex");
    await User.updateOne({ refreshToken: hashed }, { $unset: { refreshToken: 1 } });
  }

  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const emailSchema = z.object({ email: z.email() });
    const parsed = emailSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    await forgotPasswordService(parsed.data.email);

    res.json({
      success: true,
      message: "If the email exists, a reset link has been sent",
    });
  } catch (error) {
    throw error;
  }
};



export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || typeof token !== "string" || !password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Invalid token or password",
      });
    }

    await resetPasswordService(token, password);

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    throw error;
  }
};
