const authService = require("../Services/authService")
class authController {
     async registration(req,res,next)
    {
        try{
        const {registrationData} = req.body
        const userData = await authService.registration(registrationData)
        res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
        return res.json(userData)}
        catch (e){
            console.log(e)
        }

    }
    async login(req,res,next){

         try{
             const {email,password} = req.body
             const userData = await authService.login(email,password)
             res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
             return res.json(userData)
         }
         catch (e)
         {
             console.log(e)
         }
    }
    async logout(req,res,next)
    {

    }
}
module.exports = new authController()
