import axios from 'axios';
import {URI, RAZRAB} from '../URI';
//import { URI } from 'redux/URI';
import {Dispatch} from 'react';
 import AsyncStorage from '@react-native-async-storage/async-storage';


// register user регистрируем пользователя
// register user
export const registerUser =
  (name: string, email: string, password: string, avatar: string, myfirebasetoken: string) =>
  async (dispatch: Dispatch<any>) => {
    try {

//console.log( '-registerUser')
  dispatch({  type: 'userRegisterRequest', });

      const config = {headers: {'Content-Type': 'application/json'}};
     
  //   const res = await axios.get( `http://192.168.0.197:8000/api/proba`, );
  //  console.log( 'proba ->', `${URI}/registration`)
  //   console.log( 'proba res=', res.data)
// http://192.168.0.197:8000/api/v1/registration
      const {data} = await axios.post( `${URI}/registration`,
        {name, email, password, avatar, myfirebasetoken},
        config,
      );
     // console.log( '3 registerUser ответ data=', data)

      dispatch({
        type: 'userRegisterSuccess',
        payload: data.user,
      });
    //убрал 4-27-17   const user = JSON.stringify(data.user)  

    //убрал 4-27-17  await AsyncStorage.setItem('user', user); //сохраним в хранилище пользователя
   await AsyncStorage.setItem('token', data.token);

    } catch (error: any) {
     console.error('Ошибка экшен registerUser:', error);   
      dispatch({
             type: 'userRegisterFailed',
             payload: error.response.data.message,
      });
    }
  };



// // load user
export const loadUser = () => async (dispatch: Dispatch<any>) => {
  try {
  dispatch({ type: 'userLoadRequest',  }); //загрузка
    
  dispatch({ type: 'ppUser',  payload: "ПРОБУЕМ ВЗЯТЬ ИЗ ХРАНИЛИЩА token",  });

    //const jsonValue = await AsyncStorage.getItem('user');
   //4-32-21 заменим на 
   const token = await AsyncStorage.getItem('token');
   let firebasetoken  = await AsyncStorage.getItem('firebasetoken'); // сам  токен от  Firebase

    if (firebasetoken === null) {
      firebasetoken =  "aaaaa"
    }
   ///////////////////////////////////////////////////////////
  if (token === null) {
    // Токен не существует, предпринимаем необходимые действия
   // console.log('Токен не найден в AsyncStorage');
    // Например, перенаправляем пользователя на экран входа
    // или запрашиваем новый токен
    dispatch({
      type: 'userLoadFailed',
      payload: ' токена не существует token null',
    });
    dispatch({ type: 'ppUser',  payload: "Нет token null",  });
      console.error('Иногда  Ошибка экшен loadUser: token null' );  
   
 
  } else { 
//////////ТОКЕН СУЩЕСТВУЕТ//////////////////////////////////////

   dispatch({ type: 'ppUser',  payload: "По токену ищем",  });

 //  console.log(  '2-loadUser ПРОБУЕМ ВЗЯТЬ ИЗ ХРАНИЛИЩА token=', token )

// if (jsonValue !== null ) {
//       const user = JSON.parse(jsonValue) 
    
//      console.log( '2 экшен есть из хранилища loadUser=', user )
//   dispatch({
//     type: 'userLoadSuccess',
//     payload:  user ,         //{  user: data.user,  token, },
//   });
// }
   const {data} = await axios.get(`${URI}/me`, {
        headers: {Authorization: `Bearer ${token}`},
        });
    // console.log( '2.1 ЮЗЕРА нашли по токену user=', data.user )

    dispatch({ type: 'ppUser',  payload: "Юзер найден",  });
      

    
   dispatch({
     type: 'userLoadSuccess', // ф-я срабатывания
     payload:{
      user: data.user,    //загружаем юзера
      token,
      myfirebasetoken: firebasetoken,
     }
    })

  }  //конец проверки по токену

  } catch (error: any) {
   
    dispatch({
      type: 'userLoadFailed',
      payload: error.response.data.message,
    });
    dispatch({ type: 'ppUser',  payload: "Нет юзера-ошибка",  });
      console.error('Иногда  Ошибка экшен loadUser:', error);  
  }
};

  // login user
export const loginUser =
  (email: string, password: string) => async (dispatch: Dispatch<any>) => {
   
   console.log( '4  client loginUser email=', email + ' password='+ password )

    try {
      dispatch({    type: 'userLoginRequest',       });

//       const conv  = {headers: {'Content-Type': 'application/json'}}; 
//       const {dd} = await axios.post( `https://threads-clone-plum-one.vercel.app/api/proba`, 
//       {email, password},
//    conv,
//  );
      dispatch({ type: 'ppUser',  payload: "1  проверка пароля и почты",  });
      
      const config = {headers: {'Content-Type': 'application/json'}};

   //можно сделать отправка пароля по эектронной почте
    console.log( '4.1 login =', `${URI}/login`)

      const {data} = await axios.post( `${URI}/login`, 
           {email, password},
        config,
      );

      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
      } else {
        dispatch({ type: 'ppUser',  payload: "из запроса /login нет токена?? ",  });        
        dispatch({
          type: 'userLoginFailed',
          payload: 'Странно, но нет токена',
        });
      }


    //  console.log( '4   это loginUser data=', data)
    const firebasetoken = await AsyncStorage.getItem('firebasetoken'); // сам  токен от  Firebase


    //немного изменил сам payload
   dispatch({ type: 'userLoginSuccess', 
              payload:{  
                user: data.user,    //загружаем юзера
                 myfirebasetoken: firebasetoken,
                 token: data.token, //сам добавил токен (или можно при аутенфикац 
                 // в App доставать через AsyncStorage.setItem - что это безопаснее )
              }
            })

      //4-27-43 заменим const user = JSON.stringify(data.user)  
//сохраним в хранилище пользователя
     //4-27-43 заменим AsyncStorage.setItem('user', user); 
  // на
  //    перенес чуть выше сам 
  //if (data.token) {
  //   await AsyncStorage.setItem('token', data.token);
  // } else {
        
  //   dispatch({
  //     type: 'userLoginFailed',
  //     payload: 'Странно, но нет токена',
  //   });
  // }

   
  dispatch({ type: 'ppUser',  payload: "все ок пароля и почты",  });


    } catch (error: any) {

        console.error('Ошибка экшен loginUser:', error);  
      dispatch({
        type: 'userLoginFailed',
        payload: error.response.data.message,
      });
    }
  };

// log out user ввыход пользователя из системы
export const logoutUser = () => async (dispatch: Dispatch<any>) => {
  try {
    dispatch({  type: 'userLogoutRequest', });
   
   // await AsyncStorage.setItem('user', '');
   //4-33-58 на
   await AsyncStorage.setItem('token', '');
   await AsyncStorage.setItem('firebasetoken', '');
   
   dispatch({ type: 'userLogoutSuccess',   payload: {},    });

  } catch (error) {
    console.error('Ошибка экшен logoutUser:', error);    
    dispatch({  type: 'userLogoutFailed',  });
  }
};

// // get all users все отсортированнеы юзеры , кроме себя
export const getAllUsers = () => async (dispatch: Dispatch<any>) => {
  try {

    dispatch({ type: 'ppUser',  payload: "---экшен getAllUsers",  });

   console.log('------(state.isLoading = true)--экшен getAllUsers '); 

    dispatch({  type: 'getUsersRequest',  });

 

    const token = await AsyncStorage.getItem('token');

   // console.log('-------экшен getAllUsers----------token=',token); 

    const {data} = await axios.get(`${URI}/users`, {
      headers: {Authorization: `Bearer ${token}`},
    });

    //console.log('экшен getAllUsers -users state.isLoading :data.users=', data.users); 

    dispatch({ type: 'getUsersSuccess',   payload: data.users,   });

  } catch (error: any) {
       dispatch({ type: 'ppUser',  payload:  'getAllUsers ОШИБКА '+ error.response.data.message,  });
    dispatch({ 
      type: 'getUsersFailed',
      payload: error.response.data.message,
    });
    
  

console.error('Ошибка экшен getAllUsers :', error.response.data.message   )// error);
    
  }
};

interface FollowUnfollowParams {
  userId: string;
  followUserId: string;
  users: any;
  tokenfirebase: string;  //сам передаем токен для оповещения
}
 
 

// // follow user подписка, где followUserId -причина подписки
export const followUserAction =
  ({userId, users, followUserId,  tokenfirebase}: FollowUnfollowParams) =>
  async (dispatch: Dispatch<any>) => {
 // followUserId - айди на кого подписываюсь
 // userId -мой айди (кто нажимает на подпись)
    try {
      const token = await AsyncStorage.getItem('token');

  const uu =  users.filter( (us: any) => us._id === followUserId  )
//  console.log( uu[0].name, '=Подписка отфильтровали uu= ', uu[0].mytokenFirebase );

  const followUsertokenFirebase = uu[0].mytokenFirebase

  // console.log(followUserId,'=!!!!!!!!!!!!!!!!!!!=followUserId --Подписка ---unfollowUserAction userId= ', 
  //      userId +'  users='+ users. length );
  //    users.map((userObj: any) => userObj._id === userId
  //    ? 
  //     console.log( '++++++++-userObj._id === userId=',userObj._id )
  //         : console.log( '++++++++-userObj._id !== userId=',userObj._id ),
  //  );
 
 
////эта часть работает в автономном режиме (если мобила)//
//RAZRAB = 'debug'   //release debug
//*  RAZRAB = 'release'
//************************************************ */
//////Здесь проверка ненужна, т.к. сразу отображаться /////////////
 if ( RAZRAB === 'release'   ) {
   // followUserId - айди на кого подписываюсь
 // userId -мой айди (кто нажимает на подпись)
 dispatch({ type: 'subscribeUser',   payload: followUserId,    })
} //конец только при релизе 
 
dispatch({ type: 'ppUser',  payload: "user подписка" ,  });

   //Ты нажимаешь и отображает на кого подписан теперь
 const updatedUsers = users.map((userObj: any) => userObj._id === followUserId
 ? { //нашел на кого подписываюсь
     ...userObj,
   followers: [...userObj.followers, {  "userId": userId }], // userId: в ...userObj.followers добавим userId
   }
 : userObj,
 )
// console.log ('@@@@@@@ ЭКШЕНЫ SoobSubscribe---', updatedUsers ) 
 
  dispatch({ type: 'getUsersSuccess',   payload: updatedUsers,   })

  //dispatch({ type: 'ppUser',  payload: "user ПОДПИСКА="+followUsertokenFirebase ,  });
// console.log(  '=Подписка запрос на add-user '  )
     await axios.put( `${URI}/add-user`,  {followUserId },
        {  headers: { Authorization: `Bearer ${token}`, },   },
      );
   
      dispatch({ type: 'ppUser',  payload: "выполнен запрос подписки на add-user" ,  });    

    } catch (error) {
      console.log('Error following user:', error);
    }
  };



 // unfollow user - отписка от юзера
export const unfollowUserAction =
  ({userId, users, followUserId, tokenfirebase}: FollowUnfollowParams) =>
  async (dispatch: Dispatch<any>) => {
          
    try {
       const token = await AsyncStorage.getItem('token');
     
      console.log(followUserId,'=followUserId  ОТПИСКА---unfollowUserAction userId= ', 
                     userId +'  users='+ users );
    const uu =  users.filter( (us: any) => us._id === followUserId  )
  // console.log( uu[0].name, '=Подписка отфильтровали uu= ', uu[0].mytokenFirebase );
     const followUsertokenFirebase = uu[0].mytokenFirebase


 ////////////Здесь проверка ненужна, т.к. сразу отображаться /////////////////////      
 if ( RAZRAB === 'release'   ) {
  dispatch({ type: 'unsubscribeUser',   payload: followUserId,   })
     } //конец только при релизе 
 
 const updatedUsers = users.map((userObj: any) => userObj._id === followUserId
 ? {
     ...userObj,
     followers: userObj.followers.filter(
       (follower: any) => follower.userId !== userId ,
     ),
   }
 : userObj,
);

 dispatch({ type: 'getUsersSuccess',   payload: updatedUsers,   })

 //!!!!!!!!!!!!!!!!данные токена виртуальны(и могли измениться)
// dispatch({ type: 'ppUser',  payload: "user ОТПИСКА !!!!!!!!!!!!="+followUsertokenFirebase ,  });

 console.log(  '=ОТПИСКА запрос на add-user '  )

     await axios.put( `${URI}/add-user`,  {followUserId },
         { headers: { Authorization: `Bearer ${token}`, },  },
     );
     dispatch({ type: 'ppUser',  payload: "выполнен запрос ОТПИСКИ на add-user" ,  });



    } catch (error) {
      console.log('Error following user:', error);
    }
  };

 

  //interface LikesParams {
    //postId: string;
    //posts: any;
    //user: any;
  //   postId?: string | null;
    //   singleReplyId?: string; //11:06:06  добавил лайк ответ на ответ
   // }
    
     // add likes добавляем лайк
   // export const addLikes =   ({postId, posts, user}: LikesParams) =>

//потом сделаем как сохранять токен в сторедж на компе
  export const usertokenFirebase = (tokenFirebase:string,
    name:string, userName:string, bio:string, ) => async (dispatch: Dispatch<any>) => {
    try {
   //   console.log (  '+++++++++++++ЭКШЕНЫ usertokenFirebase  tokenFirebase->', tokenFirebase  ) 
    // сохраним токен Firebase в ХРАНИЛИЩЕ
    await AsyncStorage.setItem('firebasetoken', tokenFirebase) 
    dispatch({ type: 'ppUser',  payload: "сохранили токен Firebase в ХРАНИЛИЩЕ" ,  });
 
    dispatch({ type: 'getusertokenFirebase',   payload: tokenFirebase,    });

    const token = await AsyncStorage.getItem('token');
       
  // console.log (  'итак name=', name, '  userName=',userName,  '  bio=',bio   )   

   await axios.put(`${URI}/update-profile`,
           { name, userName,  bio,
               tokenFirebase:tokenFirebase,  },
        { headers: {Authorization: `Bearer ${token}` }, } )
    } catch (error) {
      console.error('Ошибка сохранения fbtokendata:', error) 
      
    }
  };
   


  
  //SoobSubscribe({ data, posts })(dispatch); 
  export const SoobSubscribe =({ datapodpiska, user, users  }: { 
      datapodpiska: any; user: any; users: any;   })=> async (dispatch: Dispatch<any>) => {
    try {
    console.log (   '   ===============ЭКШЕНЫ SoobSubscribe  datapodpiska->', datapodpiska  ) 
    dispatch({ type: 'ppUser',  payload: "сработал экшен SoobSubscribe"  ,  });
    const { ouserid ,   ouserpodpis, otik } = datapodpiska
   
// ouserid - айди  к кому пришло 
// ouserpodpis -айди  кто нажал о подписке
 
dispatch({ type: 'ppUser',  payload: "Пришли в экшены СООБЩЕНИЯ об SoobSubscribe" ,  });
  // это подписка, пришло от того юзера кто подписался ()

     if ( otik === 'SUBSCRIBE'   ) { //это добавляю кто на меня подписался
      
       dispatch({ type: 'subscribeUser',   payload: ouserpodpis,    })
}
   else {  //это отписка
 dispatch({ type: 'unsubscribeUser',   payload: ouserpodpis,   })
 
} // конец проверки


  } catch (error: any) {
    console.log(error, 'error');
  }
};