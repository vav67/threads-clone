const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(`mongodb is connected with server: ${data.connection.host}`);
    }) //добавил ошибку соединения
  //  .catch((error) => {
 //     console.error("MongoDB connection error:", error);
  //  });
};

// //ЕЩЕ ДОБАВЛЮ
// // Middleware для проверки соединения с MongoDB
// const mongodbMiddleware = (req, res, next) => {
//   // Проверка состояния соединения с MongoDB
//   if (mongoose.connection.readyState !== 1) {
//     // Соединение с базой данных отсутствует или в состоянии ошибки
//     return next(new Error("Unable to connect to the database"));
//   }

//   // Соединение с базой данных установлено, можно продолжить выполнение запроса
//   next();
// };



 module.exports = connectDatabase;
//module.exports = { connectDatabase, mongodbMiddleware };
