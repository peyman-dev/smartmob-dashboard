"use server";
import { sendRequest } from "./lib/axios";
import { LoginPayloadType } from "./types/actions.types";
import { Order, User } from "./types/types";
import { getSession } from "./utils/session";

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

// export const authorize = async () => {
//   const cookieStore = await cookies();
//   const sessionCookie = JSON.parse(JSON.stringify(cookieStore.get("smdash-session")?.value));

//   const data = await decryptSession(sessionCookie)
//   return data
// };

export const getOrders = async (params?: {
  page?: number;
  limit?: number;
  senderId?: string;
  receiver?: string;
}) => {
  const session = await getSession();
  try {
    const res = await sendRequest.get("/admin/orders_list", {
      params: {
        page: params?.page || 0,
        limit: params?.limit || 20,
      },
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const data = await res.data;
    return data;
  } catch (error) {}
};

export const getUsersList = async ({
  params,
}: {
  params: {
    page?: number;
    limit?: number;
    status?: 0 | 1;
    deviceId?: string;
    account?: string;
  };
}) => {
  try {
    const session = await getSession();
    const res = await sendRequest.get("/admin/users", {
      params,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const data = await res.data;
    return data;
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
};

export const moderateUserStatus = async ({
  status,
  user,
}: {
  status: number;
  user: User["_id"];
}) => {
  try {
    const session = await getSession();
    const response = await sendRequest.put("/admin/users_status", null, {
      params: {
        status,
        user,
      },
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const data = await response.data;
    return data;
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
};

export const getAccounts = async (queries?: {
  page?: number;
  limit?: number;
  user?: string;
  username?: string;
}) => {
  const session = await getSession();
  const params = {
    ...queries,
  };

  try {
    const res = await sendRequest.get("/admin/accounts", {
      params,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const data = await res.data;

    return data;
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
};

type OnlyStringAndNumber = number | string;

export const updateUserInfos = async (params?: {
  moneyTOMAN?: OnlyStringAndNumber;
  moneyUSD?: OnlyStringAndNumber;
  coinFollow?: OnlyStringAndNumber;
  coinOther?: OnlyStringAndNumber;
  currency?: "TOMAN" | "USD";
  user: string;
}) => {
  const session = await getSession();
  try {
    const res = await sendRequest.put("/admin/users_edit", null, {
      params,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    console.log(res);

    const data = await res.data;
    return data;
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
};

export const updateOrder = async (params: {
  order: Order["_id"];
  quantity?: number;
  quantityComp?: number;
  target?: string;
  targetId?: string;
  startNumber?: number;
  statusCode?: number;
  statusText?: string;
}) => {
  const session = await getSession();
  try {
    const res = await sendRequest.put("/admin/orders_edit", null, {
      params,
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const data = await res.data;
    return data;
  } catch (error) {
    return {
      ok: false,
      error,
    };
  }
};

export const getTransactionHistory = async (params?: {
  page?: number,
  limit?: number
}) => {
  try {
    const session = await getSession();
    const res = await sendRequest.get("/admin/transcoin_history", {
      params: {
        page:params?.page ?? 0 ,
        limit: params?.limit ?? 20
      },
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    const data = await res.data
    return data
  } catch (error) {
    return {
      ok: false,
      error
    }
  }
};
