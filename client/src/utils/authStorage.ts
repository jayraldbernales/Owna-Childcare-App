import Cookies from "js-cookie";
import CryptoJS from "crypto-js";

const SECRET_KEY = "my-super-secret-key";
const COOKIE_NAME = "auth_data";

interface AuthPayload {
  user: {
    id: string;
    firstname: string;
    email: string;
    role?: string;
  };
  token: string;
}

export const AuthStorage = {
  set: (user: AuthPayload["user"], token: string) => {
    const payload: AuthPayload = { user, token };
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(payload),
      SECRET_KEY
    ).toString();
    Cookies.set(COOKIE_NAME, encrypted, {
      expires: 7,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });
  },

  get: (): AuthPayload | null => {
    const encrypted = Cookies.get(COOKIE_NAME);
    if (!encrypted) return null;
    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch {
      AuthStorage.clear();
      return null;
    }
  },

  clear: () => {
    Cookies.remove(COOKIE_NAME);
  },
};
