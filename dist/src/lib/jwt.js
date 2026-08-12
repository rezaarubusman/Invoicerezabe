import jwt from "jsonwebtoken";
export const generateAccessToken = (payload) => {
    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new Error("JWT_ACCESS_SECRET is not configured");
    }
    return jwt.sign(payload, secret, {
        expiresIn: "15m",
    });
};
