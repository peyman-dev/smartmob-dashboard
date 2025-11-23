"use server";

import { UserSession } from "../types/types";
import { jwtVerify, SignJWT } from "jose";

const secretKey = process.env.JWT_SECRET!;
const encodedKey = new TextEncoder().encode(secretKey);

export const encryptSession = async (session: any) => {
  return await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // recommended
    .sign(encodedKey);
};

export const decryptSession = async (token: string) => {
  const { payload } = await jwtVerify(token, encodedKey, {
    algorithms: ["HS256"],
  });

  return payload;
};