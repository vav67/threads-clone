const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const connectDb = require("../db/db");

const soobadm = require("./notificationsController");
const { initializeApp } = require( "../firebase");

 


//router.route("/admin/:id").get(isAuthenticatedUser, adm);
exports.adm = catchAsyncErrors(async (req, res, next) => {
try {
  if ( !global.firebaseInitialized ) {   
    initializeApp(); // Инициализируем Firebase приложение только, если не было инициализации ранее
     global.firebaseInitialized = true
   }
    // соединение с бд
       await connectDb()
  //const { probafe } = req.body;
    const  probafe  =  req.params.ii

 console.log( ' -------- сервер это adm =', probafe )   
     
       //можно будет и по айди
// const user = await User.findById(req.params.id);

//  console.log( ' -------- сервер это adm  probafe =', probafe  ) 
  let userr = await User.findOne({ email:probafe })

  console.log( ' !!!!-------- это   =', userr)

  const mytokenFirebase = userr.mytokenFirebase
  
  console.log( ' -------- это   =', mytokenFirebase)


////////////////////////////////////
  const ttitle = 'ПРОБА'
  const bbody = ' здесь нужный текст - проба'  
 
const ousername =   'просто имя'    
const dd ={   ousername }

 
 const result = await  soobadm( mytokenFirebase, ttitle, bbody, dd)  
 


res.status(201).json({ success: true, userr });

} catch (error) { 
 // res.status(500).json({  success: false, message: error.message, })
  return next(new ErrorHandler(error.message, 401)); 

}
  });



 /*
 Да, вы правильно поняли. admin.firestore() возвращает экземпляр Firestore,
  который представляет собой подключение к базе данных Firestore в проекте Firebase.

С этим объектом firestoreDb вы можете выполнять различные операции с базой данных, 
такие как чтение, запись и запросы данных. Вот примеры использования:
 const firestoreDb = admin.firestore();

// Пример добавления документа
const newDocRef = firestoreDb.collection('users').doc('new-user-id');
newDocRef.set({
  name: 'John Doe',
  age: 30,
  // ... другие поля
});

// Пример чтения данных
const userDoc = await firestoreDb.collection('users').doc('user-id').get();
const userData = userDoc.data();

// Пример выполнения запроса
const usersQuerySnapshot = await firestoreDb.collection('users').where('age', '>', 25).get();
usersQuerySnapshot.forEach((userDoc) => {
  const userData = userDoc.data();
  // ... обработка данных пользователя
});
 
 
 */