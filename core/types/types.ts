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
  refreshToken: true;
  expiresIn: number;
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
}
