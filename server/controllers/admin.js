const User = require("../models/UserModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

 //////////сообщения/////////////////////
const admin = require( 'firebase-admin')  // добавил
const { initializeApp } = require('../firebase'); // Импортируем initializeApp из вашего firebase.ts
//const {  initializeFirebase } = require('../firebase');

//http://192.168.31.85:8000/api/admin
 // let firebaseInitialized = false; // Добавьте глобальную переменную
/////////////////////////////////////
//const soob = async ( followUsertokenFirebase, ttitle, bbody, dd) => {
  const soobadm = async ( mytokenFirebase, ttitle, bbody, dd) => {
    try {   
  
       // соединение с бд
 await connectDb()
 
      console.log('-----выполняется ф-я soob начало');   
      //const {  ouserid , ousername, ouserpodpis, otik  } = dd
      const {   ousername   } = dd

    
      if ( !global.firebaseInitialized ) {   
        initializeApp(); // Инициализируем Firebase приложение только, если не было инициализации ранее
       //firebaseInitialized = true; // Устанавливаем флаг, что Firebase был инициализирован
       global.firebaseInitialized = true
        }
  
     //   console.log("----- dd=", dd);   
      //отправка пуш-нотификация конкретному юзеру
  
      console.log('!!-----  ф-я soob отправка mytokenFirebase=', mytokenFirebase);   
        
     let result = await  admin.messaging().sendEachForMulticast({
   
      //tokens: owner.tokens, // ['token_1', 'token_2', ...]
  //tokens:[ followUsertokenFirebase],
  tokens:[ mytokenFirebase ],
  notification: {
           title:ttitle, //   'ПОДПИСКА'  : 'Заголовок уведомления сервер',   
           body: bbody, //: 'Текст уведомления сервер',  
              // owner: JSON.stringify(owner),
          //  user: JSON.stringify(user),
           // picture: JSON.stringify(picture),
          },
          data: {
          //  ouserid , 
            ousername
         //   ouserpodpis,
         //   otik
           // ,   ofirebase 
          },
     
         });
     
     console.log("result=", result);
     
   } catch (error) { console.error('Ошибка createUser:', error); }
    
  
   }




exports.adm = catchAsyncErrors(async (req, res, next) => {
try {
 // console.log( ' -------- сервер это adm ' )
  const { probafe } = req.body;
//  console.log( ' -------- сервер это adm  probafe =', probafe  ) 
  let userr = await User.findOne({ email:probafe });
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
  soobadm( mytokenFirebase, ttitle, bbody, dd)  
///////////////////////////////////////////

// res.status(200).json({
//   success: true,
//   userr,
// });
 
//res.status(200).json({ message: `${user} - такой юзер существует}` })
res.status(200).json({ message: ` такой юзер существует=`+ mytokenFirebase })
} catch (error) { 
  res.status(500).json({  success: false, message: error.message, })
    }
  });



 