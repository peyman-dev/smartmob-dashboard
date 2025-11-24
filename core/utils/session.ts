"use server";

import { cookies } from "next/headers";
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

export const getSession = async (): Promise<UserSession | null> => {
  try {
    const cookieStore = await cookies();
    const sessionCookie =
      cookieStore.get(process.env.COOKIE_NAME as string)?.value || null;

    if (!sessionCookie) return null;

    const response = await decryptSession(sessionCookie);

    return response as unknown as UserSession;
  } catch (error) {
    return null;
  }
};
