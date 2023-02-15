import { generateSync } from "text-to-image";
import {generateRandomChars} from "./generateRandomChars.js";
import { logger } from "../Logger/logger.js";
export const generateCaptcha = () => {
    const captcha = generateRandomChars(6);
    logger.silly("Captcha : ", captcha);
    const imgData = generateSync(captcha, {maxWidth: 90, customHeight: 50, fontSize: 20,fontFamily:'Sans'})
    return {captcha, imgData}
}
