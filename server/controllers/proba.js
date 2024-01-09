
const connectDb = require("../db/db");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/UserModel");

const { VV } = require("../version");
 

 


exports.hom = catchAsyncErrors(async (req, res, next) => {
    
    try {

 // соединение с бд
 await connectDb();

 const useri = await User.find() //все юзеры
    //console.log( 'это проба')
       // res.status(200).json({ message: "Это тестовый маршрут /proba" });
  //пока      res.status(200).json({ message: `${useri.length}- всего  и  V ${VV()}` }); // версия
   const aa = " это версия "    
        res.status(201).json({  success: true, aa });
     
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  exports.homlog = catchAsyncErrors(async (req, res, next) => {
    
    try {

      const  email =  "qq@i.ua"
      const password =  "12345"

 // соединение с бд
 await connectDb();

 const user = await User.findOne({ email }).select("+password");

 if (!user) {
   return next(
     new ErrorHandler("User is not find with this email & password", 499)
   );
 }
else {
  res.status(200).json({ message: `${user} - такой юзер существует}` })
}

    //console.log( 'это проба')
       // res.status(200).json({ message: "Это тестовый маршрут /proba" });
     /////   res.status(200).json({ message: `${useri.length}- всего  и  V ${VV()}` }); // версия
      
     
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
