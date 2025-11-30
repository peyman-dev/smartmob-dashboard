// const userSession = {
//     name: personalInfo.name,
//     family: personalInfo.family,
//     roles: data.roles,
//     deviceId: data.deviceId,
//     accessToken: data.token.access_token,
//     refreshToken: data.token.refresh_token,
//     expiresIn: data.token.expires_in

//   };

export interface UserSession {
  name: string;
  family: string;
  roles: Record<any, any>;
  deviceId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  avatar: User["accountInfo"]["avatar"];
}

export interface User {
  _id: string;
  deviceId: string;
  password: string;

  accountInfo: {
    money: {
      TOMAN: number;
      USD: number;
    };
    coin: {
      follow: number;
      other: number;
    };
    avatar: {
      server: string;
      url: string;
      thumb: string;
    };
    apiToken: string;
    name: string;
    currency: "TOMAN" | "USD"; // فعلاً فقط این دوتا توی دیتا دیدم
    presenter: string | null;
    downloadFrom: string;
    status: number;
    joinDate: number;
    loginDate: number;
    lastActionDate: number;
    username: string;
  };

  personalInfo: {
    name: string;
    family: string;
    birthdayDate: string;
    birthdayPlace: string;
    nationalCode: string;
    certificateCode: string;
    addressHome: string;
    addressWork: string;
  };

  roles: {
    ghost: boolean;
    manager: boolean;
    admin: boolean;
    adminPanel: string[]; // یا هر تایپی که توی ادمین پنل استفاده می‌شه
  };

  contacts: {
    email: {
      email: string;
      verify: boolean;
    };
    phone: {
      countryCode: string;
      phone: string;
      verify: boolean;
    };
  };

  token: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
  };
}

export interface Account {
  _id: string;
  user: string;
  fullName: string;
  userId: string;
  username: string;
  cookie: string;
  sessionId: string;
  sessionIdSetting: string;
  gender: -1 | 0 | 1;
  dateCreate: number;
  password: string
}

export type Order = {
  _id: string;
  id: number;
  user: string;
  serviceId: string | null;
  target: string;
  targetId: string;
  img: string;
  comments: any[];
  quantity: number;
  quantityComp: number;
  startNumber: number;
  usersCompleted: any[];
  mode: number;
  status: {
    code: number;
    color: string;
    text: string;
    textPer: string;
  };
  dateCreate: number;
  dateUpdate: number;
  price: number;
  priceModel: string;
};

export type CoinTransaction = {
  _id: string;
  user1: string;
  user2: string;
  coinModel: number;
  coinNumber: number;
  dateCreate: number;
};

export type Locale = "en" | "fa";

type CurrencyLimits = {
  min: number;
  max: number;
};

type CheckoutMinMax = {
  TOMAN: CurrencyLimits;
  USD: CurrencyLimits;
};

type Url = {
  nameServer: string;
  urlServer: string;
};

type PrivacyItem = {
  title: string;
  data: string;
};

type FaqItem = {
  title: string;
  data: string;
};

export type Setting =
  | {
      name: "systemStatus";
      desc: string;
      editable: boolean;
      data: { enfejarTimer: boolean };
    }
  | {
      name: "socialsMedia";
      desc: string;
      editable: boolean;
      data: {
        telegramSupport: string;
        telegramChannel: string;
        instagramSupport: string;
        instagramPage: string;
        website: string;
      };
    }
  | { name: "ipServer"; desc: string; editable: boolean; data: string }
  | { name: "lastVersion"; desc: string; editable: boolean; data: number }
  | { name: "changeList"; desc: string; editable: boolean; data: string }
  | { name: "zarinPalMerchant"; desc: string; editable: boolean; data: string }
  | { name: "zarinPalRedirect"; desc: string; editable: boolean; data: string }
  | {
      name: "checkoutMinMax";
      desc: string;
      editable: boolean;
      data: CheckoutMinMax;
    }
  | { name: "urls"; desc: string; editable: boolean; data: Url[] }
  | { name: "privacy"; desc: string; editable: boolean; data: PrivacyItem[] }
  | { name: "faq"; desc: string; editable: boolean; data: FaqItem[] }
  | { name: "lastOrderId"; desc: string; editable: boolean; data: number }
  | { name: "lastVersionEnable"; desc: string; editable: boolean; data: number }
  | { name: "newVersionLink"; desc: string; editable: boolean; data: string }
  | {
      name: "orderLimit";
      desc: string;
      editable: boolean;
      data: CurrencyLimits;
    };

// اگر بخوای کل تنظیمات رو به صورت آرایه مدیریت کنی
export type SettingsArray = Setting[];

export type UserFindEndpoints = "users" | "accounts" | "transfers" | "orders";
