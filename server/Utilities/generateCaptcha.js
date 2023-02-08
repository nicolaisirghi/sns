import { generateSync } from "text-to-image";
import {generateRandomChars} from "./generateRandomChars.js";
import { logger } from "../utils/logger.js";
export const generateCaptcha = () => {
    const captcha = generateRandomChars(6);
    logger.silly("Captcha : ", captcha);
    const dataUri = generateSync(captcha, {maxWidth: 90, customHeight: 50, fontSize: 20})
    const imgData = dataUri.split(",")[1];
    return {captcha, imgData}
}
