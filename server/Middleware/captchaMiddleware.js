export const captchaMiddleware = (req,res,next)=>
{

if(!req.session.captchaCounter)
{
    req.session.captchaCounter = 1;
}
else {
    if(req.session.captchaCounter === 3)
    {
        console.log("Need captcha!")
        // res.status(200).send('Captcha required ! ')
    }
    else{
        req.session.captchaCounter++;
    }
}
    next()
}