"use server";
import { sendRequest } from "./lib/axios";
import { LoginPayloadType } from "./types/actions.types";
import { Order, User, UserFindEndpoints } from "./types/types";
import { getSession } from "./utils/session";

export const login = async (payload: LoginPayloadType) => {
  const writeParams = () => {
    if (payload?.code) {
      return {
        params: {
          code: payload.code,
        },
      };
    } else {
      return null;
    }
  };
  try {
    const res = await sendRequest.post(
      "/enrollment/login",
      JSON.stringify(payload),
      {
        headers: {
          "Content-Type": "application/json",
        },
        ...writeParams(),
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
  email?: string;
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
  page?: number;
  limit?: number;
}) => {
  try {
    const session = await getSession();
    const res = await sendRequest.get("/admin/transcoin_history", {
      params: {
        page: params?.page ?? 0,
        limit: params?.limit ?? 20,
      },
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

export const getSettings = async () => {
  try {
    const session = await getSession();
    const res = await sendRequest.get("/setting", {
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

export const getStatistics = async () => {
  try {
    const session = await getSession();
    const res = await sendRequest.get("/admin/statistics", {
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

export const getUserById = async (
  endpoint: UserFindEndpoints,
  user: string
) => {
  const session = await getSession();

  if (!session?.accessToken) {
    return { ok: false, error: "No access token" };
  }

  const params: Record<string, any> = {
    page: 0,
    limit: 20,
  };

  let url = "";
  switch (endpoint) {
    case "users":
      url = "/admin/users";
      params.account = user; 
      break;

    case "accounts":
      url = "/admin/accounts";
      params.user = user; 
      params.username = user; 
      break;

    case "transfers":
      url = "/admin/transcoin_history";
      params.sender = user;
      params.receiver = user;
      break;

    case "orders":
      url = "/admin/orders_list";
      params.user = user
      break;
  }

  
  try {
    const res = await sendRequest.get(url, {
      params,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      error: error.response?.data || error.message || "Request failed",
    };
  }
};
export const getAdminUsers = async (user: string) => {
  const session = await getSession();

  if (!session?.accessToken) {
    return { ok: false, error: "No access token" };
  }

  const params: Record<string, any> = {
    page: 0,
    limit: 20,
    user,
  };

  try {
    const res = await sendRequest.get("/admin/users", {
      params,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      error: error.response?.data || error.message || "Request failed",
    };
  }
};

export const getAdminAccounts = async (user: string) => {
  const session = await getSession();

  if (!session?.accessToken) {
    return { ok: false, error: "No access token" };
  }

  const params: Record<string, any> = {
    page: 0,
    limit: 20,
    user,
  };

  try {
    const res = await sendRequest.get("/admin/accounts", {
      params,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      error: error.response?.data || error.message || "Request failed",
    };
  }
};

export const getAdminTransfers = async (user: string) => {
  const session = await getSession();

  if (!session?.accessToken) {
    return { ok: false, error: "No access token" };
  }

  const params: Record<string, any> = {
    page: 0,
    limit: 20,
    sender: user,
  };

  try {
    const res = await sendRequest.get("/admin/transcoin_history", {
      params,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      error: error.response?.data || error.message || "Request failed",
    };
  }
};

export const getAdminOrders = async (user: string) => {
  const session = await getSession();

  if (!session?.accessToken) {
    return { ok: false, error: "No access token" };
  }

  const params: Record<string, any> = {
    page: 0,
    limit: 20,
    user,
  };

  try {
    const res = await sendRequest.get("/admin/orders_list", {
      params,
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    return { ok: true, data: res.data };
  } catch (error: any) {
    return {
      ok: false,
      error: error.response?.data || error.message || "Request failed",
    };
  }
};

export const getAccount = async (userId: string) => {
  try {
    const session = await getSession();
    const res = await sendRequest.get("/admin/accounts", {
      params: {
        user: userId,
      },
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });

    const data = await res.data;

    return data;
  } catch (error) {}
};

export const updateSetting = async (payload: {
  name: string;
  data: string;
}) => {
  const session = await getSession();
  try {
    const res = await sendRequest.put("/admin/settings_edit", undefined, {
      params: payload,
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
