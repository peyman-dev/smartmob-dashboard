"use server";

import { cookies } from "next/headers";
import { UserSession } from "../types/types";
import { encryptSession } from "../utils/session";

export default async function setAuthorization(user: any) {
  const personalInfo = user.personalInfo;

  const session: UserSession = {
    name: personalInfo.name,
    family: personalInfo.family,
    roles: user.roles,
    deviceId: user.deviceId,
    accessToken: user.token.access_token,
    refreshToken: user.token.refresh_token,
    expiresIn: user.token.expires_in,
  };

  const securedSession = await encryptSession(session);
const cookieStore = await cookies()
  cookieStore.set("smdash-session", securedSession, {
    httpOnly: true,                   
    secure: process.env.NODE_ENV === "production", 
    sameSite: "lax",             
    path: "/",                       
    maxAge: 60 * 60 * 24 * 7,       
  });
}