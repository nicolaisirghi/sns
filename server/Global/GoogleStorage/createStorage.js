import { Storage } from "@google-cloud/storage";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const gc = new Storage({
  keyFilename: path.join(__dirname, "./google_cloud_storage.json"),
});
