const mongoose = require("mongoose");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("./catchAsyncErrors.js");
 

exports.mmongodbMiddleware = catchAsyncErrors(async (req, res, next) => {
   // соединение с бд
 await connectDb();
 // console.log( 'isAuthenticatedUser  проверка соединения'  )
    // Проверка состояния соединения с MongoDB
    if (mongoose.connection.readyState !== 1) {
        // Соединение с базой данных отсутствует или в состоянии ошибки
        return next(new ErrorHandler("Unable to connect to the database", 404));
      }

  // Соединение с базой данных установлено, можно продолжить выполнение запроса 
  next(); //дальше
});

 