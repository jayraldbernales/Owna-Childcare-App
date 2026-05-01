import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { AuthStorage } from "../utils/authStorage";

jest.mock("js-cookie");
jest.mock("crypto-js", () => ({
  AES: {
    encrypt: jest.fn().mockReturnValue({ toString: () => "encrypted-data" }),
    decrypt: jest.fn().mockReturnValue({
      toString: () => '{"user":{"id":"123"},"token":"abc"}',
    }),
  },
  enc: { Utf8: {} },
}));

describe("AuthStorage", () => {
  const mockUser = { id: "123", firstname: "John", email: "test@example.com" };
  const mockToken = "test-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("set()", () => {
    it("stores encrypted data in cookies", () => {
      AuthStorage.set(mockUser, mockToken);

      expect(CryptoJS.AES.encrypt).toHaveBeenCalledWith(
        JSON.stringify({ user: mockUser, token: mockToken }),
        "my-super-secret-key"
      );
      expect(Cookies.set).toHaveBeenCalledWith(
        "auth_data",
        "encrypted-data",
        expect.objectContaining({ secure: true, sameSite: "Strict" })
      );
    });
  });

  describe("get()", () => {
    it("returns null when no cookie exists", () => {
      (Cookies.get as jest.Mock).mockReturnValue(undefined);
      expect(AuthStorage.get()).toBeNull();
    });

    it("returns decrypted data when cookie exists", () => {
      (Cookies.get as jest.Mock).mockReturnValue("valid-data");
      expect(AuthStorage.get()).toEqual({
        user: { id: "123" },
        token: "abc",
      });
    });

    it("clears storage and returns null on decryption failure", () => {
      (Cookies.get as jest.Mock).mockReturnValue("invalid-data");
      (CryptoJS.AES.decrypt as jest.Mock).mockImplementation(() => {
        throw new Error("Decryption failed");
      });

      const result = AuthStorage.get();
      expect(result).toBeNull();
      expect(Cookies.remove).toHaveBeenCalledWith("auth_data");
    });
  });

  describe("clear()", () => {
    it("removes the auth cookie", () => {
      AuthStorage.clear();
      expect(Cookies.remove).toHaveBeenCalledWith("auth_data");
    });
  });
});
