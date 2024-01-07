const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("./catchAsyncErrors.js");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel.js");
const connectDb = require("../db/db");


exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  
  console.log( 'isAuthenticatedUser  проверка соединения'  )
// здесь добавил
 // Проверка доступа к базе данных
//  if (!isDatabaseConnected()) {
//   console.log( 'isAuthenticatedUser нет соединения'  )
//   return next(new ErrorHandler("Database access error", 500));
// }
// console.log( '----- isAuthenticatedUser проверку соединения прошли'  )

 // соединение с бд
 await connectDb();

  const authHeader = req.headers.authorization;
 console.log( 'isAuthenticatedUser  запрос req.headers=', req.headers )

 //Носитель не определен -  Bearer undefined
if( !authHeader || authHeader === 'Bearer undefined' || !authHeader.startsWith("Bearer "))
    {
    return next(new ErrorHandler("Please login to continue",401));
     }

  const token = authHeader.split(" ")[1];
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  
  req.user = await User.findById(decoded.id);
  //теперь в req содержиться поле user
  next(); //дальше
});


//такой был
// exports.qqisAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
//  // console.log( 'isAuthenticatedUser  запрос=', req )
//     //берем токен у куки
//   const { token } = req.cookies;

//   if (!token) {
//     return next(new ErrorHandler("Please Login for access this resource", 401));
//   }

//   const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);

//   req.user = await User.findById(decodedData.id);

//   next();
// });

// Проверка доступа к базе данных
// function isDatabaseConnected() {
//   // Здесь реализуйте логику проверки доступа к базе данных
//   // Возможно, вы можете использовать метод, предоставленный вашей библиотекой для проверки состояния подключения
//   // Например, если вы используете Mongoose, 
//   //это может выглядеть как mongoose.connection.readyState === 1
//   // Вам нужно заменить это условие на соответствующее для вашей среды

//   if (mongoose.connection.readyState === 1) {
//   return true; // Возвращаем true, если соединение с базой данных установлено
//   }
//   return false
// }