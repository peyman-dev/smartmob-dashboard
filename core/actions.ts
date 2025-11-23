"use server"
import { sendRequest } from "./lib/axios";
import { LoginPayloadType } from "./types/actions.types";

export const login = async (payload: LoginPayloadType) => {
  try {
    const res = await sendRequest.post(
      "/enrollment/login",
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.data;
    return data;
  } catch (error) {
    return {
      error,
    };
  }
};
