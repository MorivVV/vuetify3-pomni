import { AES } from "crypto-js";
const AESencrypt = (text: string, pass: string): string => {
  if (text === "") return "";
  return AES.encrypt(text, pass).toString();
};
export default AESencrypt;
