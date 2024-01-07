 const admin = require( 'firebase-admin')  // добавил
 
  const { initializeApp } = require('../firebase'); // Импортируем initializeApp из вашего firebase.ts
 
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//http://192.168.31.85:8000/api/admin
let firebaseInitialized = false; // Добавьте глобальную переменную





exports.adm = catchAsyncErrors(async (req, res, next) => {
try {
 
    if (!firebaseInitialized) {
      initializeApp(); // Инициализируем Firebase приложение только, если не было инициализации ранее
      firebaseInitialized = true; // Устанавливаем флаг, что Firebase был инициализирован
    }

    //отправка пуш-нотификация конкретному юзеру
   let result = await  admin.messaging().sendEachForMulticast({
 
        //tokens: owner.tokens, // ['token_1', 'token_2', ...]
tokens:['eUn7d2moT2aRCMD-KwSL8n:APA91bFjv3FO-k3nHTs5KgM_J0UrISX1oOUt6DsCtBTpCBZajArVkIaJb5QjIroqK9IUCV9rNUQrt11GZlKFzwc3AMCD_l_iHjdDGpSKlgDy4yeONYhOF-YNX5NErXkExav-Ek4OH2f8'],
notification: {
        title: 'Заголовок уведомления сервер',   
        body: 'Текст уведомления сервер',     
            // owner: JSON.stringify(owner),
        //  user: JSON.stringify(user),
         // picture: JSON.stringify(picture),
        },
        data: {
          ow: 'qqqqqqqqqqq',
        },
   
       });
   
    //console.log( 'это проба')
    // res.status(200).json({ message: "Это тестовый маршрут /proba" });
  //  console.log("result=", result);
    
    res.status(201).json({
      success: true,
      result,
    });

//метод посылает пуши всим (пример -  " сегодня у нас акция")
//------------------
// const message = {  data: {  type: 'warning', content: 'A new weather warning has been created!',  },
//     topic: 'weather',
//   };
  
//   admin
//     .messaging()
//     .send(message)
//     .then(response => { console.log('Successfully sent message:', response);  })
//     .catch(error => { console.log('Error sending message:', error); });
//-----

} catch (error) { res.status(500).json({  success: false, message: error.message, })
    }
  });




  //  Log out user
// exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
//     res.cookie("token", null, {
//       expires: new Date(Date.now()),
//       httpOnly: true,
//       sameSite: "none",
//       secure: true,
//     });
  
//     res.status(200).json({
//       success: true,
//       message: "Log out success",
//     });
//   });
  