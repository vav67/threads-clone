import axios from 'axios';
import {URI, RAZRAB} from '../URI';
//import { URI } from 'redux/URI';
import {Dispatch} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


// create post
export const createPostAction =
  (
    title: string,
    image: string,
    user: Object,
    replies: Array<{title: string; image: string; user: any}>,
  ) =>
  async (dispatch: Dispatch<any>) => {
   
    try { 
       dispatch({ type: 'postCreateRequest',  });

   const token = await AsyncStorage.getItem('token');

      const {data} = await axios.post(
        `${URI}/create-post`,
        {title, image, user, replies},
        {
          headers: {
           Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
          },
        },
      );
      dispatch({
        type: 'postCreateSuccess',
        payload: data.user,
      });
    } catch (error: any) {
      console.error('Ошибка экшен createPostAction:', error);  

      dispatch({
        type: 'postCreateFailed',
        payload: error.response.data.message,
      });
    }
  };

 // get all Posts
export const getAllPosts = () => async (dispatch: Dispatch<any>) => {
  try {
    console.log('------getAllPosts загрузка постов' );

    dispatch({   type: 'getAllPostsRequest',    });

    const token = await AsyncStorage.getItem('token');

    const {data} = await axios.get(`${URI}/get-all-posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  dispatch({ type: 'getAllPostsSuccess', payload: data.posts, });
    
  } catch (error: any) {
    console.error('Ошибка экшен getAllPosts:', error);  
    dispatch({
      type: 'getAllPostsFailed',
      payload: error.response.data.message,
    });
  }
};

interface LikesParams {
//postId: string;
//posts: any;
//user: any;

  postId?: string | null;
  posts: any;
  user: any;
  replyId?: string | null;
  title?: string;
  singleReplyId?: string; //11:06:06  добавил лайк ответ на ответ
}

 // add likes добавляем лайк
export const addLikes =   ({postId, posts, user}: LikesParams) =>
  async (dispatch: Dispatch<any>) => {
      try {
     const token = await AsyncStorage.getItem('token');
 //'*****addLikes  posts=' , posts,
  //     console.log(
  //       '****** vsego=',posts.length,     
  //       '*****1  postId=' , postId,
  //      '*****2  user.name=' , user.name,
  //      '*****3  user._id=' , user._id,
  //      '*****4  user.avatar=' , user.avatar.url
  //                ) 
  // console.log( "---- RAZRAB=", `${RAZRAB}`)
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// т.е. отмечает у себя и тому кому послал
//************************************************ */
////эта часть работает в автономном режиме (если мобила)//
//RAZRAB = 'debug'   //release debug
//*  RAZRAB = 'release'
if ( RAZRAB === 'release' ) {
 const updatedPosts = posts.map(
  (userObj: any) => userObj._id === postId ? {
     ...userObj,   //весь объект
     likes: [      // и к нему добавляю
             ...userObj.likes, //все лайки
                {              // и также это еще
                  userName: user.name,
                  userId: user._id,
                  userAvatar: user.avatar.url,
                  postId,
                },
              ],
            } :  userObj, //или возвращаю объект без изменений
      );
// диспатчим  - добавляю посты
dispatch({ type: 'getAllPostsSuccess', payload: updatedPosts,  });

}

/////////////////////////////////////////


 await axios.put( `${URI}/update-likes`, {postId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );


      console.log(
        'окончена отправка экшен addLikes' )

    } catch (error: any) {
      console.log(error, 'error');
    }
  };



// // remove likes
export const removeLikes =
  ({postId, posts, user}: LikesParams) => async (dispatch: Dispatch<any>) => {
    try {
      const token = await AsyncStorage.getItem('token');

///// ===========================
//RAZRAB = 'debug'   //release debug
//*  RAZRAB = 'release'
    ////////////////  console.log( "---- RAZRAB=", `${RAZRAB}`)
      //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // т.е. отмечает у себя и тому кому послал
    //************************************************ */
    ////эта часть работает в автономном режиме (если мобила)//
if ( RAZRAB === 'release' ) {

      const updatedPosts = posts.map((userObj: any) =>
        userObj._id === postId
          ? {
              ...userObj,
              likes: userObj.likes.filter(
                (like: any) => like.userId !== user._id,
              ),
            }
          : userObj,
      );

      dispatch({  type: 'getAllPostsSuccess', payload: updatedPosts,  });
/////////////////////////////////////////
}
 

console.log(  '====removeLikes  postId=' , postId)  
      
     
      await axios.put( `${URI}/update-likes`, {postId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error('Ошибка  Error following likes:', error);
    }
  };



 // add likes to reply лайки на ответы
export const addLikesToReply =
  ({postId, posts, user, replyId, title}: LikesParams) =>
            async (dispatch: Dispatch<any>) => {
    try {
   
   
     const token = await AsyncStorage.getItem('token');
  
      const updatedPosts = posts.map((post: any) =>
        post._id === postId
          ? {
              ...post,
              replies: post.replies.map((reply: any) =>
                reply._id === replyId
                  ? {
                      ...reply,
                      likes: [
                        ...reply.likes,
                        {
                          userName: user.name,
                          userId: user._id,
                          userAvatar: user.avatar.url,
                        },
                      ],
                    }
                  : reply,
              ),
            }
          : post,
      );
   
 dispatch({type: 'getAllPostsSuccess', payload: updatedPosts,  });

// console.log( '-------addLikesToReply='  )   
      await axios.put(
      //  `${URI}/update-replies-react`, //? update-reply-likes
     `${URI}/update-reply-likes`,
       { postId, replyId, replyTitle: title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      //console.error('Ошибка --- Error addLikesToReply:', error);
      console.log('Ошибка --- Error addLikesToReply:', error);
    }
  };


  
 


// 10-50-01  remove likes from reply
  export const removeLikesFromReply =
                 ({postId, posts, user, replyId}: LikesParams) =>
   async (dispatch: Dispatch<any>) => {
      try {
       const token = await AsyncStorage.getItem('token');

      const updatedPosts = posts.map((post: any) =>
        post._id === postId
          ? {
              ...post,
       replies: post.replies.map((reply: any) => reply._id === replyId
                  ? {  ...reply,
      likes: reply.likes.filter( (like: any) => like.userId !== user._id, ),}
                  : reply,
              ),
            }
          : post,
      );

      dispatch({  type: 'getAllPostsSuccess',    payload: updatedPosts,   });

      await axios.put( `${URI}/update-replies-react`, {postId, replyId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error: any) {
      console.log(error, 'error');
    }
  };



// // add likes to replies > reply
export const addLikesToRepliesReply =
  ({postId, posts, user, replyId, singleReplyId, title}: LikesParams) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const updatedPosts = posts.map((post: any) =>
        post._id === postId 
          ? {
              ...post,
              replies: post.replies.map((r: any) =>
                r._id === replyId
                  ? {
                      ...r,
                      reply: r.reply.map((reply: any) =>
                        reply._id === singleReplyId
                          ? {
                              ...reply,
                              likes: [
                                ...reply.likes,
                                {
                                  userName: user.name,
                                  userId: user._id,
                                  userAvatar: user.avatar.url,
                                },
                              ],
                            }
                          : reply,
                      ),
                    }
                  : r,
              ),
            }
          : post,
      );

      dispatch({
        type: 'getAllPostsSuccess',
        payload: updatedPosts,
      });

   // console.log( '---------экшен addLikesToRepliesReply=', postId, 
 //   replyId, singleReplyId,   title)  

      await axios.put(
        `${URI}/update-reply-react`,
        {postId, replyId, singleReplyId, replyTitle: title},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.log(error, 'error');
    }
  };




// remove likes from replies > reply
export const removeLikesFromRepliesReply =
  ({postId, posts, user, replyId, singleReplyId}: LikesParams) =>
  async (dispatch: Dispatch<any>) => {
    try {
      const token = await AsyncStorage.getItem('token');

      const updatedPosts = posts.map((post: any) =>
        post._id === postId
          ? {
              ...post,
              replies: post.replies.map((r: any) =>
                r._id === replyId
                  ? {
                      ...r,
                      reply: r.reply.map((reply: any) =>
                        reply._id === singleReplyId
                          ? {
                              ...reply,
                              likes: reply.likes.filter(
                                (like: any) => like.userId !== user._id,
                              ),
                            }
                          : reply,
                      ),
                    }
                  : r,
              ),
            }
          : post,
      );

      dispatch({
        type: 'getAllPostsSuccess',
        payload: updatedPosts,
      });

      await axios.put(
        `${URI}/update-reply-react`,
        {postId, replyId, singleReplyId},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error: any) {
      console.log(error, 'error');
    }
  };

  export const SoobLike =({ data, posts }: { data: any; posts: any })=>
  async (dispatch: Dispatch<any>) => {
    try {
     
    console.log (  '@@@@@@@ ЭКШЕНЫ SoobLike постов==', posts.length    ) 
      
      //dispatch({ type: 'ppUser',  payload: data,  });

//сюда впишем логику лайков на уровне стори, а в бд они уже записаны по идеи
///////////////////////////////////////
// = "opost": "6516b82c131850820bf4f79c", 
//"ouseravatarurl": "https://res.cloudinary.com/dtqakzp25/image/upload/v1695982978/avatars/m5sluuyaazx3uxpyyuiu.jpg",
//= "ouserid": "6516a5831696a261009cb2bd",
// "ousername": "qq", 
// "ouseruserName": "qq750"

////////////////////////////////////////

// console.log( 'vsego=', posts.length  ,
//        '=======1 opost =',  data.opost,
//        '=======2 ousername =',  data.ousername, 
//        '=======3 ouserid =',  data.ouserid, 
//  '=======4 ouseravatarurl =',  data.ouseravatarurl        
//        ) 

  if (data.ousername === null || data.ousername === "") {
    console.log( 'снимаем лайк')
  const updatedPosts = posts.map((userObj: any) =>
  userObj._id === data.opost
    ? {
        ...userObj,
        likes: userObj.likes.filter(
          (like: any) => like.userId !== data.ouserid,
        ),
      }
    : userObj,
);

  dispatch({  type: 'getAllPostsSuccess', payload: updatedPosts,  });

   }
  else {
  console.log( 'ЛАЙК ставим')
      const postId =    data.opost
       const updatedPosts = posts.map((userObj: any) => {
     
        if (userObj._id === data.opost) {
          console.log( userObj.likes.length ,'=совпало-- ', data.opost);
          return {  
              ...userObj, // или возвращайте модифицированный объект, если это необходимо
              likes: [      // и к нему добавляю
                        ...userObj.likes,     //все лайки
             {              // и также это еще
                   name: data.ousername,   
              //userName: data.ousername,
                 userId: data.ouserid,
                 userAvatar: data.ouseravatarurl,
                     postId ,  // ?????? что за поле
     //помогает postId  * В этом коде предполагается, что action.payload содержит массив посто                
                     },
                 ],
              }
           } else {   return userObj;  }
      });


        //   const oupdatedPosts = posts.map(
        //  (userObj: any) => userObj._id === data.opost ? {
                   
        //   ...userObj,   //весь объект
        //    likes: [      // и к нему добавляю
        //            ...userObj.likes, //все лайки
        //               {              // и также это еще
        //                 userName: data.ousername,
        //                 userId: data.ouserid,
        //                 userAvatar: data.ouseravatarurl,
        //                 postId: data.opost,
        //               },
        //             ],
        //        } :  userObj, //или возвращаю объект без изменений
        //    );
    
    

        // const up = updatedPosts.map((userObj: any) => {
        //   if (userObj._id === data.opost) {
        //     console.log('+++++++++++++++объект=', userObj)
        //     return  userObj                  
        //          } else {   return userObj  }
        //   })


        // // диспатчим  - добавляю посты
    
      dispatch({ type: 'getAllPostsSuccess', payload: updatedPosts,  });
      
}

    } catch (error: any) {
      console.log(error, 'error');
    }
  };