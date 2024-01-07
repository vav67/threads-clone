
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
        res.status(200).json({ message: `${useri.length}- всего  и  V ${VV()}` }); // версия
      
     
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });