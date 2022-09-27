import AES from "crypto-js/aes";
import CryptoJS from "crypto-js";
import { SESSION_SECRET } from "~/services/core/env";

export async function encrypt(plaintext: string): Promise<string> {
  return AES.encrypt(plaintext, SESSION_SECRET).toString();
}

export async function decrypt(ciphertext: string): Promise<string> {
  const bytes = AES.decrypt(ciphertext, SESSION_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}
