
const User = require("../models/UserModel");
const Notification = require("../models/NotificationModel"); //модель 4-49-44

const ErrorHandler = require("../utils/ErrorHandler.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken.js");
const cloudinary = require("cloudinary");

const connectDb = require("../db/db");

//////////сообщения/////////////////////
const admin = require( 'firebase-admin')  // добавил
const { initializeApp } = require('../firebase'); // Импортируем initializeApp из вашего firebase.ts

//http://192.168.31.85:8000/api/admin
let firebaseInitialized = false; // Добавьте глобальную переменную
/////////////////////////////////////

const soob = async (tokenfirebase) => {

  try {
 
    if (!firebaseInitialized) {
      initializeApp(); // Инициализируем Firebase приложение только, если не было инициализации ранее
      firebaseInitialized = true; // Устанавливаем флаг, что Firebase был инициализирован
    }

    //отправка пуш-нотификация конкретному юзеру
   let result = await  admin.messaging().sendEachForMulticast({
 
        //tokens: owner.tokens, // ['token_1', 'token_2', ...]
tokens:[tokenfirebase],
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
   
    console.log("result=", result);
   
 } catch (error) { console.error('Ошибка createUser:', error); }
  

 }






// Register user
exports.createUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name, email, password, avatar } = req.body;

 // соединение с бд
 await connectDb()

    let user = await User.findOne({ email });
    
    console.log( '3 это createUser =', user)

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    let myCloud;

    if (avatar) {
       myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",  });
    }
  // Обычно изображения не сохраняются непосредственно на локальном сервере, 
      //а загружаются на сторонний сервис для хранения файлов, такой как 
      //  Cloudinary, Amazon S3 или Firebase Storage. Затем URL изображения сохраняется  
      // в базе данных или используется непосредственно в коде, чтобы отображать  
      // изображение на веб-страницах. 

      const userNameWithoutSpace = name.replace(/\s/g, "");

      const uniqueNumber = Math.floor(Math.random() * 1000);

      user = await User.create({
      name,
      email,
      password,
         userName: userNameWithoutSpace + uniqueNumber,
      avatar: avatar
        ? { public_id: myCloud.public_id, url: myCloud.secure_url }
        : null,
    });
//заменил пока
    // user = await User.create({
    //   name,
    //   email,
    //   password,
    //   avatar: {public_id:11, url:'https://cdn-icons-png.flaticon.com/128/568/568717.png'},
    // });



    //console.log( 'результат createUser =', user)

    sendToken(user, 201, res);
  } catch (error) {
   
    console.error('Ошибка createUser:', error); // Выводим ошибку в консоль
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  console.log( 'сервер вход юзера loginUser  =', email)

  if (!email || !password) {
    return next(new ErrorHandler("Please enter the email & password", 400));
  }

   // соединение с бд
 await connectDb();

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(
      new ErrorHandler("User is not find with this email & password", 401)
    );
  }
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(
      new ErrorHandler("User is not find with this email & password", 401)
    );
  }

  sendToken(user, 201, res);
});

//  Log out user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  res.status(200).json({
    success: true,
    message: "Log out success",
  });
});

//  Get user Details
exports.userDetails = catchAsyncErrors(async (req, res, next) => {
  console.log( 'userDetails =', )
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});


// get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  
  console.log( '4-36-40 getAllUsers req=', req.user )
 // console.log( '4-36-40 getAllUsers  req.user.id=', req.user.id )

  const loggedInuser = req.user.id;

 // соединение с бд
 await connectDb();

 // const users = await User.find().sort({  createdAt: -1 });
   const users = await User.find({ _id: { $ne: loggedInuser } }).sort({
   createdAt: -1,
   });

  res.status(201).json({
    success: true,
    users,
  });
});

// Follow and unfollow user   Подписаться и отписаться от пользователя
exports.followUnfollowUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const loggedInUser = req.user; //  пользователь ( мой айди )
    
    const { followUserId, tokenfirebase } = req.body;//подписчик(к кому хочу подписаться)

    // boolean   ищем в поле following пользователя
  const isFollowedBefore = loggedInUser.following.find(
       (item) => item.userId === followUserId
     );

 console.log( 'followUnfollowUser подписка (это я) польз-ь=', loggedInUser +
           '  айди подписчик (это к кому) =' + followUserId )

//берем айди пользователя
    const loggedInUserId = loggedInUser._id;

    // да он есть
    if (isFollowedBefore) {

      console.log('---ЕСТЬ --ПОПЫТКА удалить');    
    
     // соединение с бд
 await connectDb();
      //УДАЛЯЕМ
      // нашли его,  здесь мы pull  -!!!  т.е мой айди удалим у пользователю к которому я подписался
      await User.updateOne(
        { _id: followUserId },  //айди подписчика
        { $pull: { followers: { userId: loggedInUserId }
       } } //айди пользователя
      );
 //удалим из моей папки following айди к которому я подписался
      await User.updateOne(
        { _id: loggedInUserId },//айди пользователя
        { $pull: { following: { userId: followUserId } } }//подписчик
      );

      //Уведомление об удалении
      await Notification.deleteOne({
        "creator._id": loggedInUserId, //мой айди
        userId: followUserId, //айди к которому я был подписан
        type: "Follow",
      });

      res.status(200).json({
        success: true,
        message: "User unfollowed successfully",
      });
    } else {
      //ДОБАВЛЯЕМ
      console.log('-----ПОПЫТКА ДОБАВИТь');  
      // соединение с бд
 await connectDb();

// ненашли его ,  здесь мы push  -!!!  т.е мой айди заносим к пользователю к которому я подписался
      await User.updateOne( //первое знач- кому, второе - что
        { _id: followUserId }, //айди к кому я хочу подписаться  
   //ЧТО ДОБАВЛЯЮ
        { $push: { followers: { userId: loggedInUserId } ,
                   podpisani: { usertoken: tokenfirebase } ,          
                 },
                 $inc: { podpisaniNumber: 1 }, // Увеличиваем podpisaniNumber на 1         
       } //мой айди добавили к нему 
                        );
 
      await User.updateOne(
        { _id: loggedInUserId }, //айди мой
        { $push: { following: { userId: followUserId } } } //и вносим ко мне к кому я подписываюсь
        
        );

     // Уведомление что я подписался
      await Notification.create({
        creator: req.user,
        type: "Follow",
        title: "Followed you подписался",
        userId: followUserId, //айди к которому я подписался
      });

      soob = asynk (tokenfirebase)

      res.status(200).json({
        success: true,
        message: "User followed successfully Пользователь успешно подписан",
      });
      }
  } catch (error) {
    console.error('сервер Ошибка ПОДПИСКИ followUnfollowUser:', error); // Выводим ошибку в консоль
    return next(new ErrorHandler(error.message, 401));
  }
});

// get user notification
exports.getNotification = catchAsyncErrors(async (req, res, next) => {
  try {

     // соединение с бд
 await connectDb();


    const notifications = await Notification
    .find({ userId: req.user.id }) //кто ко мне подписался
    .sort( { createdAt: -1 } );

    res.status(201).json({
      success: true,
      notifications,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});


// get signle user
exports.getUser = catchAsyncErrors(async (req, res, next) => {
  try {

     // соединение с бд
 await connectDb();
    const user = await User.findById(req.params.id);

    res.status(201).json({ success: true, user });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

//редактируем профиль юзера 12-55-13
// update user avatar
exports.updateUserAvatar = catchAsyncErrors(async (req, res, next) => {
  try {
     // соединение с бд
 await connectDb();
    let existsUser = await User.findById(req.user.id);

    if (req.body.avatar !== "") {
      const imageId = existsUser.avatar.public_id;

  // удаление картинки     
      await cloudinary.v2.uploader.destroy(imageId);
// запишем новую картинку
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });

      existsUser.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    await existsUser.save();

    res.status(200).json({
      success: true,
      user: existsUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

// update user info
exports.updateUserInfo = catchAsyncErrors(async (req, res, next) => {
  try {

     // соединение с бд
 await connectDb();

    const user = await User.findById(req.user.id);

    user.name = req.body.name;
    user.userName = req.body.userName;
    user.bio = req.body.bio;

    await user.save();

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});
