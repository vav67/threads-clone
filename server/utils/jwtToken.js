// create token and saving that in cookies
const sendToken = (user,statusCode,res) =>{

    const token = user.getJwtToken();

    // Options for cookies
   const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
   };

/**
 * SameSite: Параметр sameSite установлен в "none". Это необходимо, если
 *  ваш сайт используется во фреймах или iframe. В противном случае, 
 * для безопасности, лучше установить sameSite в "strict" или "lax".
 * 
 */

   //console.log( ' создали token в куки', )
   res.status(statusCode).cookie("token",token,options).json({
       success: true,
       user,
       token
   });
}

module.exports = sendToken;