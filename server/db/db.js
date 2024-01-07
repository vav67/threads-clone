const mongoose = require("mongoose");
//import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

//Если MongoDb uri не указан, мы выдадим ошибку.
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}
const connectDb = async () =>{
  try{
     // console.log("пробуем mongoDB ", MONGO_URL)
  // теперь бд booking
/////   await mongoose.connect(MONGO_URL)
const { connection } = await mongoose.connect( MONGODB_URI)
//console.log( 'rez=', connection  )
//.then(()=> console.log("Соединение с бд успешно!") )
///     console.log("Соединение с бд успешно!") 
if (connection.readyState == 1) {
  console.log("Соединение с бд успешно! database connected");
}
//host: 'ac-muzaitc-shard-00-01.aj1b6xw.mongodb.net',
//port: 27017,
//name: 'NNext13'


}
   catch{(err) =>{console.log("бд ошибка=", err)} }
  }

// // Когда мы впервые подключаемся к базе данных, мы кэшируем это соединение в переменной с именем Cache, чтобы нам не приходилось снова и снова подключаться к базе данных при каждом запросе. 
// let cached = global.mongoose

// // Если у нас нет кешированного соединения, сначала мы установим conn: null, promise: null
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null }
// }

// // создание асинхронной функции для подключения к db
// async function connectDb() {
//   // Если у нас есть кешированное соединение, нам не нужно устанавливать соединение еще раз. мы вернем старое соединение.
//   if (cached.conn) {  return cached.conn  }
//   // Если у нас нет кешированного соединения, мы создадим его и вернем.
//   if (!cached.promise) {
//       const opts = { bufferCommands: false, }
//  cached.promise = await 
//       mongoose
//           .connect(MONGODB_URI, {
//           //  useNewUrlParser: true
//        //   useUnifiedTopology: true
//           })
//           .then((mongoose) => {
//       return mongoose
//     })
//   }

//   try {
//     cached.conn = await cached.promise
//   } catch (e) {
//     cached.promise = null
//     throw e
//   }

//   return cached.conn
// }


// const connectDatabase = () => {
//   mongoose
//     .connect(process.env.DB_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     .then((data) => {
//       console.log(`mongodb is connected with server: ${data.connection.host}`);
//     }) //добавил ошибку соединения


















 module.exports = connectDb;
//export default connectDatabase
