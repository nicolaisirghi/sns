const generateRandomChars = require("./generateRandomChars")
const textToImage = require("text-to-image")
module.exports = generateCaptcha = () => {
    const captcha = generateRandomChars(6);
    console.log("Captcha : ", captcha);
    const dataUri = textToImage.generateSync(captcha, {maxWidth: 90, customHeight: 50, fontSize: 20})
    const imgData = dataUri.split(",")[1];
    return {captcha, imgData}
}
