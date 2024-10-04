import { AES, enc } from "crypto-js";
const AESdecrypt = (encryptedMessage: string, pass: string): string => {
  if (encryptedMessage === "") return "";
  const decryptedMessage = AES.decrypt(encryptedMessage, pass);
  return decryptedMessage.toString(enc.Utf8);
};
export default AESdecrypt;
