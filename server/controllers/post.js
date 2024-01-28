 const Post = require("../models/PostModel");
 const connectDb = require("../db/db");

 const ErrorHandler = require("../utils/ErrorHandler.js");
  const catchAsyncErrors = require("../middleware/catchAsyncErrors");
  const cloudinary = require("cloudinary");
  const Notification = require("../models/NotificationModel");

  const yesNotifi = "no" //пока нет нотификации

//////////сообщения/////////////////////
// временно const admin = require( 'firebase-admin')  // добавил
 const { initializeApp, admin } = require('../firebase'); // Импортируем initializeApp из вашего firebase.ts
///////////////////////////////////

const soob = async (tokenfirebase, ttitle, bbody, dd ) => {

  try {

    const { ousername , ouseruserName, ouserid, ouseravatarurl , opost  } = dd
    // console.log( 'soob dd=', dd)

   // if (!firebaseInitialized) {
    if ( !global.firebaseInitialized ) {   
      initializeApp(); // Инициализируем Firebase приложение только, если не было инициализации ранее
     //firebaseInitialized = true; // Устанавливаем флаг, что Firebase был инициализирован
     global.firebaseInitialized = true
      }

    //отправка пуш-нотификация конкретному юзеру
   let result = await  admin.messaging().sendEachForMulticast({
 
        //tokens: owner.tokens, // ['token_1', 'token_2', ...]
tokens:[tokenfirebase],
notification: {
        title:ttitle, // : 'Заголовок уведомления сервер',   
        body: bbody, //: 'Текст уведомления сервер',     
            // owner: JSON.stringify(owner),
        //  user: JSON.stringify(user),
         // picture: JSON.stringify(picture),
         
        },
        data: {
          // dd:  'xxxxxxxxxxxxxxxx'
           ousername,
           ouseruserName, 
            ouserid,
              ouseravatarurl ,
              opost 
        },
   
       });
   //----- для лайка нужен айди пост и юзер который изменяет


 //   console.log("result=", result);
   
 } catch (error) { console.error('Ошибка soob :', error); }
  

 }

  

  


 // create post
exports.createPost = catchAsyncErrors(async (req, res, next) => {
  try {
    const { image } = req.body;


    let myCloud;

    if (image) {
      myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "posts",
      });
    }

    let replies = req.body.replies.map((item) => {
      if (item.image) {
        const replyImage = cloudinary.v2.uploader.upload(item.image, {
          folder: "posts",
        });
        item.image = {
          public_id: replyImage.public_id,
          url: replyImage.secure_url,
        };
      }
      return item;
    });

 // соединение с бд
 await connectDb();

    const post = new Post({
      title: req.body.title,
      image: image
        ? {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          }
        : null,
      user: req.body.user,
      replies,
    });

    await post.save();

    res.status(201).json({  success: true,  post, });

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));  }
});

// // get all posts
exports.getAllPosts = catchAsyncErrors(async (req, res, next) => {
  try {

 // соединение с бд
 await connectDb()

    const posts = await Post.find().sort({
      createdAt: -1,
    });

    res.status(201).json({ success: true, posts });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

 // add or remove likes
exports.updateLikes = catchAsyncErrors(async (req, res, next) => {

/**
   *  вы должны определить переменную tokenfb перед началом блока try.
   *  Таким образом, она будет видна во всей области функции. 
   */
let tokenfb; // Переменная определена в области видимости функции



  try {

    console.log('---------------------------------------------------updateLikes  ')
    const postId = req.body.postId;
     // соединение с бд
 await connectDb()

    const post = await Post.findById(postId);
//совпало

 console.log( req.user.id, '  000=req.user.id========updateLikes post =', post ) 
//---------------------------------------------
// это было const tokenfb = req.user.mytokenFirebase 
//----------------------------------------------------
 //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!   
// найдем юзера к которому будем отсылать сообщение (возьмем свежие токены Firebase)
//здесь забираем только одно поле , для быстрой связи
let myFirebaseuser = await User.findOne({ _id: followUserId }).select('mytokenFirebase')

//????????????????????????????????
// а если нет такого пользователя или нет такого поля mytokenFirebase
if (myFirebaseuser && myFirebaseuser.mytokenFirebase) {
  // Пользователь найден и имеет поле mytokenFirebase
   tokenfb = myFirebaseuser.mytokenFirebase;
  // Теперь вы можете использовать mytokenFirebase по вашему усмотрению
} else {
  // Пользователь не найден или не имеет поля mytokenFirebase
   tokenfb = 'myerror'
  console.log("Пользователь не найден или не имеет поля mytokenFirebase");
}





const likeInUser = req.user

//console.log( likeInUser, ' = name ========  mytokenFirebase=', tokenfirebase) 


    const isLikedBefore = post.likes.find((item) => item.userId === req.user.id );

    if (isLikedBefore) {
  //да есть т.е. нажато на лайк  и теперь удалим лайк  pull из массива
//await Post.updateMany({ _id: postId,},{
//  $pull: {  likes: {
  //userName: req.user.name,  
  //userId: req.user.id,
//  userAvatar: req.user.avatar.url,
// postId, } }
//  })
  
//  удаляем из поста
 await Post.findByIdAndUpdate(postId, {
        $pull: {  likes: { userId: req.user.id,},  },  });

        //console.log(  '1  ===updateLikes  ' , postId) 
 // соединение с бд
// await connectDb()


//const yesNotifi = "no" //пока нет нотификации
     if (yesNotifi === "yes") {
// проверяем , если в посте нет , то в Notification
      if (req.user.id !== post.user._id) {
        console.log( post.user._id, '===2  ===updateLikes req.user.id=' , req.user.id) 
     
    // const noti = await Notification.findById(????);
       //??? А если нет его, то что удалять

       await Notification.deleteOne({
          "creator._id": req.user.id,
          userId: post.user._id,
          type: "Like",
          postId: postId,  //13-47-57
        });

      }
    
    }// конец пока нет нотификации



     // console.log(  '3 ===updateLikes') 

////////////////////////////////////
const ttitle = 'ЛАЙК'
const bbody = ' отменил лайк ' + likeInUser.name
const ousername =  ''  // likeInUser.name
const ouseruserName = ''  //likeInUser.userName
 const ouserid =  likeInUser.id
const ouseravatarurl =    ''  //likeInUser.avatar.url
 const opost = postId

const dd ={ ousername , ouseruserName, ouserid, ouseravatarurl , opost  }
soob(tokenfb, ttitle, bbody, dd)
///////////////////////////////////////////



      res.status(200).json({
        success: true,
        message: "Like removed successfully",
      });
     } 
    else {
// не найден isLikedBefore
//console.log(  '1 не найден isLikedBefore=updateLikes  ') 
      await Post.updateOne(
        { _id: postId },
        {
          $push: {
            likes: {
              name: req.user.name,  //конечно добавил в модель POST 11-30-,,
              userName: req.user.userName,
              userId: req.user.id,
              userAvatar: req.user.avatar.url,
                 postId, // ?????? что за поле
            },
          },
        }
      );
  //    console.log(  req.user.id,
 //    '=req.user.id 2   не найден isLikedBefore  post.user._id=',post.user._id) 


 //const yesNotifi = "no" //пока нет нотификации
if (yesNotifi === "yes") {
 
       // проверяем , если в посте нет , то в Notification
      if (req.user.id !== post.user._id) {
// console.log(  '--!!!!------------сохраним   postId=',
// postId + '  ---------post.user._id=' + post.user._id +
//        ' --------req.user='+  req.user  )     
      
await Notification.create({
          creator: req.user,
          type: "Like",
          title: post.title ? post.title : "Liked your post",
          userId: post.user._id,
          postId: postId, //13-47-57
        });
      }
}// конец пока нет нотификации


////////////////////////////////////
//----- для лайка нужен айди пост и юзер который изменяет
const ttitle = 'ЛАЙК'
const bbody = ' добавил лайк ' + likeInUser.name
const ousername =  likeInUser.name
const ouseruserName =  likeInUser.userName
const ouserid =  likeInUser.id
const ouseravatarurl =  likeInUser.avatar.url
 const opost = postId
const dd ={ ousername , ouseruserName, ouserid, ouseravatarurl , opost  }

soob(tokenfb, ttitle, bbody, dd)
///////////////////////////////////////////


      res.status(200).json({
        success: true,
        message: "Like Added successfully",
      });
     }
     console.log(  '--!!!!-------------Like Added successfully')


  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});




 
 //add reply in replies
exports.addReplies = catchAsyncErrors(async (req, res, next) => {
  try {
    const postId = req.body.postId;

// console.log( '-----------------------------где юзер  req=', req )

    let myCloud;

    if (req.body.image) {
      myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "posts",
      });
    }

 // соединение с бд
 await connectDb()

//Создали строку ответа
    const replyData = {
    //  user: req.user, //откуда user ?????????????????
    user: req.body.user,  //сам добавил user( так как данные всегда от bbb) 
    title: req.body.title,
      image: req.body.image
        ? {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          }
        : null,
      likes: [],
    };

    // Find the post by its ID Ищем
    let post = await Post.findById(postId);

    if (!post) { //нет такого поста
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Add the reply data to the 'replies' array of the post
    // Добавляем данные ответа в массив ответов сообщения.
    post.replies.push(replyData);

    // Save the updated post
    await post.save();

    res.status(201).json({  success: true,   post,  });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});



//ppNotifi, //сам добавил
exports.ppNotifi = catchAsyncErrors(
      async (req, res, next) => {

  try {
     console.log( 'ppNotifi    req.user=', req.user)
 // соединение с бд
 await connectDb()


     //This Notifications API interface is used to configure and display 
     //desktop notifications to the user.
     
 const qq =  await Notification.create(
  {   creator: req.user, //loggedInUser, // сам изменил    //req.user,
      type: "Like",
      title: "proba",//   replyTitle ? replyTitle : "Liked your Reply",
      userId:  '64f1f1f843c79d914c5a7eef',   //post.user._id,  //  const logg = post.user._id;
     postId: "64f1e0cd5a184a8ea379a90c",         //
    });
console.log( '---------------rez - qq==', qq)

    return res.status(200).json({
      success: true,
      message: "ppNotifi  successfully!",
    });

  }  catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});



// add or remove likes on replies
exports.updateReplyLikes = catchAsyncErrors(async (req, res, next) => {

  try {
    const postId = req.body.postId;  //айди поста
    const replyId = req.body.replyId; //айди ответа
    const replyTitle = req.body.replyTitle;
     // соединение с бд
 await connectDb()
   
// ищем пост 
    const post = await Post.findById(postId);
    
   //  console.log( '0 -----updateReplyLikes---- postId=', postId ) 

 //  console.log( '1 ---------updateReplyLikes-------- Нашли пост post =', post )  
   const logg = post.user._id;


    if (!post) { // пост не найден
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
       // Find the reply in the 'replies' array based on the given replyId
    //Найдем ответ в массиве «ответы» по заданному идентификатору ответа.
const reply = post.replies.find((reply) => reply._id.toString() === replyId);
//const replyIndex= post.replies.findIndex((reply) => reply._id === replyId)
// if (replyIndex === -1){ Reply not found}
    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }
 // console.log( post,'-- post  2 --updateReplyLikes---Нашли ответ reply =', reply)  

 // Проверьте, понравился ли ответ пользователю уже   
//Check if the user has already liked the reply
// const isLikedBefore =post.replies[replyIndex].likes.find(
   const isLikedBefore =                   reply.likes.find(
            (item) => item.userId === req.user.id
    );


    if (isLikedBefore) {
 //------Если лайк есть     
 //--...8-35-00 старый вариант
 //-- await Post.updateOne(   { _id: postId },
 //--    {     $pull: {
 //--            [`replies.${replyIndex}.likes`]: {  userId: req.user.id,},
 //--                },  } );
 // заменено на
    // If liked before, remove the like from the reply.likes array
  //    Если понравилось раньше, удалите лайк из массива       
      reply.likes = reply.likes.filter((like) => like.userId !== req.user.id);

  //console.log( '3 ---------updateReplyLikes--------Есть лайк к ответу reply.likes =',  reply.likes)  
 
  //const yesNotifi = "no" //пока нет нотификации
if (yesNotifi === "yes") {

  if (req.user.id !== post.user._id) {

        await Notification.deleteOne({
          "creator._id": req.user.id,
          userId: post.user._id,
          type: "Reply",
           postId: postId,  //13-47-57
        });
      } 

}// конец пока нет нотификации

 // console.log( '4 ---------updateReplyLikes-------- сохраняем' )  


      await post.save();

      return res.status(201).json({
        success: true,
        message: "Like removed from reply successfully",
      });
    } //конец если лайк есть


  //Итак если лайка нет
 //-------------Если лайка нет, добавьте лайк в массив
    // If not liked before, add the like to the reply.likes array
    const newLike = {
      // userName: req.user.name,  11-29-04  заменим на
         name: req.user.name,   //конечно добавил в модель POST 11-30-,,
       userName: req.user.userName,
    
      userId: req.user.id,
      userAvatar: req.user.avatar.url,
    };


  //console.log( '3 ---------updateReplyLikes--------Нету лайка к ответу newLike =',  newLike)      
    reply.likes.push(newLike);


// убрано то что ниже
        //else {  if not liked before, add the like to the reply
      //       await Post.updateOne(
      //   { _id: postId },
      //   {
      //     $push: {
      //       [`replies.${replyIndex}.likes`]: {  
      //         userName: req.user.name,
      //         userId: req.user.id,
      //         userAvatar: req.user.avatar.url,
      //       },
      //     },
      //   }
      // );
    //  console.log( '4 ---------updateReplyLikes------проверяем в Notification') 

      //const yesNotifi = "no" //пока нет нотификации
if (yesNotifi === "yes") {
 
   // проверяем , если в посте нет , то в Notification
   if (req.user.id !== post.user._id) {
  //  console.log( '4.1 -======updateReplyLikes----создаем в Notification postId=', postId) 
    //   await Notification.create({
    //   creator: req.user,
    //    type: "PROBA Follow",
    //    title: "Followed you подписался",
    //    userId: "27676437634",  // followUserId, //айди к которому я подписался
    //    postId: "a2767643cz7634",
    //         });

    //  console.log( '4.2 -======updateReplyLikes- ЗАПИСАН-') 
    
    await Notification.create({
        creator: req.user, //loggedInUser, // сам изменил    //req.user,
        type: "Like",
        title: "proba",//   replyTitle ? replyTitle : "Liked your Reply",
        userId:  logg,   //post.user._id,  //  const logg = post.user._id;
       postId: postId,         // 13-47-57
      });
    }
}// конец пока нет нотификации
 

    //console.log( '5 ---------updateReplyLikes-----сохраняем')  

    await post.save();


    return res.status(200).json({
      success: true,
      message: "Like added to reply successfully",
    });

  }  catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});


  // add reply in replies
  exports.addReply = catchAsyncErrors(async (req, res, next) => {
   try {
     const replyId = req.body.replyId; //айди самой реплики
      const postId = req.body.postId; // айди поста этой реплики

     let myCloud;

    if (req.body.image) {
      myCloud = await cloudinary.v2.uploader.upload(req.body.image, {
        folder: "posts",
      });
    }
//собираем на того юзера , что дает ответ
    const replyData = {
     //  user: req.user, //откуда user ?????????????????
    user: req.body.user,  //сам добавил user( так как данные всегда от bbb) 
      title: req.body.title,
      image: req.body.image
        ? {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          }
       :
         null,
      likes: [],
    };

     // соединение с бд
 await connectDb()

 //console.log(replyId ,'=replyId exports.addReply postId=',postId )   
//     // Find the post by its ID ---  Нахожу пост
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
 // console.log( '1 ----------------------- Это пост post =', post )  

   // ищу реплику в посте по айди
    // Find the reply by it's ID
    let data = post.replies.find((reply) => reply._id.toString() === replyId);
    
   //console.log(  ' 2 --------------   в  post.replies ищем по replyId итак data=', data  )  


    if (!data) {
      return next(new ErrorHandler("Reply not found", 401));
    }
 

 //console.log( '3  ---------------- в data.reply добавим  replyData=',replyData)  
//9-58-31
     data.reply.push(replyData);//????????сам заменю на
   
    // data.replies.push(replyData) //сам
       //==// Add the reply data to the 'replies' array of the post
    //==// Добавляем данные ответа в массив ответов сообщения.
    //==//post.replies.push(replyData);  



    //console.log( '!!!!!============================= data.reply.push' )  
    // Save the updated post
    await post.save();

   // console.log( '3  записан post=',post)  
    res.status(201).json({
      success: true,
      post,
    });
    } catch (error) {
     console.log(error);
      return next(new ErrorHandler(error.message, 400));
   }
  });


 // add or remove likes on replies reply
exports.updateRepliesReplyLike = catchAsyncErrors(async (req, res, next) => {
  try {
    const postId = req.body.postId;
    const replyId = req.body.replyId;
    const singleReplyId = req.body.singleReplyId;
    const replyTitle = req.body.replyTitle;
 // соединение с бд
 await connectDb()


    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Find the reply in the 'replies' array based on the given replyId
    const replyObject = post.replies.find(
      (reply) => reply._id.toString() === replyId
    );

    if (!replyObject) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    // Find the specific 'reply' object inside 'replyObject.reply' based on the given replyId
    const reply = replyObject.reply.find(
      (reply) => reply._id.toString() === singleReplyId
    );


    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    // Check if the user has already liked the reply
    const isLikedBefore = reply.likes.some(
      (like) => like.userId === req.user.id
    );

    if (isLikedBefore) {
      // If liked before, remove the like from the reply.likes array
      reply.likes = reply.likes.filter((like) => like.userId !== req.user.id);

       //const yesNotifi = "no" //пока нет нотификации
if (yesNotifi === "yes") {
  
      if (req.user.id !== post.user._id) {
        await Notification.deleteOne({
          "creator._id": req.user.id,
          userId: post.user._id,
          type: "Reply",
          postId: postId,  //13-47-57
        });
      }
 
  }// конец пока нет нотификации

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Like removed from reply successfully",
      });
    }

    // If not liked before, add the like to the reply.likes array
    const newLike = {
      name: req.user.name,  //конечно добавил в модель POST 11-30-,,
      userName: req.user.userName,
      userId: req.user.id,
      userAvatar: req.user.avatar.url,
    };

    reply.likes.push(newLike);

    //const yesNotifi = "no" //пока нет нотификации
if (yesNotifi === "yes") {
    
    if (req.user.id !== post.user._id) {
      await Notification.create({
        creator: req.user,
        type: "Like",
        title: replyTitle ? replyTitle : "Liked your Reply",
        userId: post.user._id,
        postId: postId, //13-47-57
      });
    }
  
  }// конец пока нет нотификации


    await post.save();

    return res.status(200).json({
      success: true,
      message: "Like added to reply successfully",
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error.message, 400));
  }
});




  // delete post
exports.deletePost = catchAsyncErrors(async (req, res, next) => {
  try {

 // соединение с бд
 await connectDb()

    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new ErrorHandler("Post is not found with this id", 404));
    }

    // удаление картинки ( а в ответах картинки удалять надо ??????? или
    // когда пользователь чистит чат )
    //( наверное раз в полгода все картинки старые надо удалять)
   if(post.image?.public_id){
    await cloudinary.v2.uploader.destroy(post.image.public_id);
   }

   await Post.deleteOne({_id: req.params.id});

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler(error, 400));
  }
});
