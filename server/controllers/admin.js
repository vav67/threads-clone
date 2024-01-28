const User = require("../models/UserModel");
const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const connectDb = require("../db/db");

 //////////сообщения/////////////////////
//пока const admin = require( 'firebase-admin')  // добавил
const { initializeApp, admin } = require('../firebase'); // Импортируем initializeApp из вашего firebase.ts
//const {  initializeFirebase } = require('../firebase');

//http://192.168.31.85:8000/api/admin
 // let firebaseInitialized = false; // Добавьте глобальную переменную
/////////////////////////////////////
//const soob = async ( followUsertokenFirebase, ttitle, bbody, dd) => {
  const soobadm = async ( mytokenFirebase, ttitle, bbody, dd) => {
    try {   
 
 
      console.log('-----выполняется ф-я soob начало');   
      //const {  ouserid , ousername, ouserpodpis, otik  } = dd
      const {   ousername   } = dd

        if ( !global.firebaseInitialized ) {   
          initializeApp(); // Инициализируем Firebase приложение только, если не было инициализации ранее
           global.firebaseInitialized = true
         }
   console.log('**********  ф-я soob отправка mytokenFirebase=', mytokenFirebase);   
        
     let result = await  admin.messaging().sendEachForMulticast({
     tokens:[ mytokenFirebase ],
  notification: {
           title:ttitle,    
           body: bbody,   
      
          },
          data: {
                ousername
              }, /////////////////
       android: {
               priority: 'high'
            }
         })
     
     console.log("result=", result);
     
   } catch (error) {
    console.error('Ошибка ф-я soobadm:', error);
    throw error; // Пробросить ошибку вверх для обработки в контроллере
         }
   }



//router.route("/admin/:id").get(isAuthenticatedUser, adm);
exports.adm = catchAsyncErrors(async (req, res, next) => {
try {
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
//  const ouserid = loggedInUserId.toString() // айди юзера изменяет подписку
//  const ousername =  loggedInUser.name
//  const ouserpodpis = followUserId
//  //const ofirebase   = tokenfirebase     
//  const otik = 'UNSUB'             
//  const dd ={ ouserid , ousername, ouserpodpis, otik }
// // console.log('-----отправляем ф-ю soob');  
// // soob( followUsertokenFirebase, ttitle, bbody, dd)
const ousername =   'просто имя'    
const dd ={   ousername }

  // Используйте функцию initializeApp здесь
 ///// initializeApp();


  soobadm( mytokenFirebase, ttitle, bbody, dd)  
///////////////////////////////////////////

// res.status(200).json({
//   success: true,
//   userr,
// });
 
//res.status(200).json({ message: `${user} - такой юзер существует}` })
//res.status(200).json({ message: ` такой юзер существует=`+ mytokenFirebase })
res.status(201).json({ success: true, userr });

} catch (error) { 
 // res.status(500).json({  success: false, message: error.message, })
  return next(new ErrorHandler(error.message, 401)); 

}
  });



 