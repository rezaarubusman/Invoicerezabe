import jwt from "jsonwebtoken";
import type { Role } from "@prisma/client";

export interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: Role;
  sessionId: string;
}

export const generateAccessToken = (
  payload: JwtPayload
): string => {
  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret) {
    throw new Error("JWT_ACCESS_SECRET is not configured");
  }

  return jwt.sign(payload, secret, {
    expiresIn: "15m",
  });
};