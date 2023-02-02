const validateToken = require("../Services/tokenService").validateAccessToken
module.exports = (req,res,next)=>
{
    try {
        const authorizationHeader = req.headers.authorization
        if (!authorizationHeader) throw new Error("Cannot find authorization header")
        const accessToken = authorizationHeader.split(' ')[1]
        if(!accessToken) throw  new Error("Not access token in header ")
        const userData = validateToken(accessToken)
        if (!userData) throw new Error("Wrong token! ")
        req.user = userData;
        next();
    }
    catch (e){
        console.log(e)
    }
}