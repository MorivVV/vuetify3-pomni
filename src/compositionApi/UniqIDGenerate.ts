import { Md5 } from "ts-md5/dist/md5";
export const uniq_id = () => Md5.hashStr("salt" + Date.now() * Math.random());
