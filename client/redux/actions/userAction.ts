import axios from 'axios';
import {URI} from '../URI';
//import { URI } from 'redux/URI';
import {Dispatch} from 'react';
 import AsyncStorage from '@react-native-async-storage/async-storage';


// register user регистрируем пользователя
// register user
export const registerUser =
  (name: string, email: string, password: string, avatar: string) =>
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
        {name, email, password, avatar},
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
    
  dispatch({ type: 'ppUserToken',  payload: "ПРОБУЕМ ВЗЯТЬ ИЗ ХРАНИЛИЩА token",  });

    //const jsonValue = await AsyncStorage.getItem('user');
   //4-32-21 заменим на 
   const token = await AsyncStorage.getItem('token');
 
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
    dispatch({ type: 'ppUserNO',  payload: "Нет token null",  });
      console.error('Иногда  Ошибка экшен loadUser: token null' );  
   
 
  } else { 
//////////ТОКЕН СУЩЕСТВУЕТ//////////////////////////////////////

   dispatch({ type: 'ppUserTokenDB',  payload: "По токену ищем",  });

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

    dispatch({ type: 'ppUserYES',  payload: "Юзер найден",  });
      

    
   dispatch({
     type: 'userLoadSuccess', // ф-я срабатывания
     payload:{
      user: data.user,    //загружаем юзера
      token,
     }
    })

  }  //конец проверки по токену

  } catch (error: any) {
   
    dispatch({
      type: 'userLoadFailed',
      payload: error.response.data.message,
    });
    dispatch({ type: 'ppUserNO',  payload: "Нет юзера-ошибка",  });
      console.error('Иногда  Ошибка экшен loadUser:', error);  
  }
};

  // login user
export const loginUser =
  (email: string, password: string) => async (dispatch: Dispatch<any>) => {
   
   // console.log( '4  client loginUser email=', email + ' password='+ password )

    try {
      dispatch({    type: 'userLoginRequest',       });

      dispatch({ type: 'ppUserNO',  payload: "проверка пароля и почты",  });

      const config = {headers: {'Content-Type': 'application/json'}};

   //можно сделать отправка пароля по эектронной почте
  // console.log( '4.1 login =', `${URI}/login`)
      const {data} = await axios.post( `${URI}/login`, 
           {email, password},
        config,
      );

     // console.log( '4   это loginUser data=', data)

      dispatch({ type: 'userLoginSuccess', payload: data.user, });

      dispatch({ type: 'ppUserNO',  payload: "все ок пароля и почты",  });

      //4-27-43 заменим const user = JSON.stringify(data.user)  
//сохраним в хранилище пользователя
     //4-27-43 заменим AsyncStorage.setItem('user', user); 
  // на
       if (data.token) {
         await AsyncStorage.setItem('token', data.token);
       }

       
    } catch (error: any) {

      dispatch({ type: 'ppUserNO',  payload: "Ошибка экшен loginUser пароля и почты",  }); 
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
   
   dispatch({ type: 'userLogoutSuccess',   payload: {},    });

  } catch (error) {
    console.error('Ошибка экшен logoutUser:', error);    
    dispatch({  type: 'userLogoutFailed',  });
  }
};

// // get all users все отсортированнеы юзеры , кроме себя
export const getAllUsers = () => async (dispatch: Dispatch<any>) => {
  try {

   // console.log('------(state.isLoading = true)--экшен getAllUsers '); 

    dispatch({  type: 'getUsersRequest',  });

 

    const token = await AsyncStorage.getItem('token');

    const {data} = await axios.get(`${URI}/users`, {
      headers: {Authorization: `Bearer ${token}`},
    });

 //   console.log('экшен getAllUsers -users state.isLoading :data.users=', data.users); 

    dispatch({ type: 'getUsersSuccess',   payload: data.users,   });

  } catch (error: any) {
     
    dispatch({ 
      type: 'getUsersFailed',
      payload: error.response.data.message,
    });
    
    dispatch({ type: 'ppUsersError',  payload: error.response.data.message,  });

console.error('Ошибка экшен getAllUsers :', error.response.data.message   )// error);
    
  }
};

interface FollowUnfollowParams {
  userId: string;
  followUserId: string;
  users: any;
  tokenfirebase: string;  //сам передаем токен для оповещения
}
 
 

// // follow user подписка
export const followUserAction =
  ({userId, users, followUserId,  tokenfirebase}: FollowUnfollowParams) =>
  async (dispatch: Dispatch<any>) => {

    console.log('Подписка followUserAction userId= ', userId  );
// console.log('Подписка followUserAction tokenfirebase= ', tokenfirebase  );
    try {
      const token = await AsyncStorage.getItem('token');

    // если совпадает айди пользователя и айди подписки пользователя 
 //    
//  const  updatedUsers = users.map((userObj: any) => userObj._id === followUserId
//      ?     
//         { ...userObj,
//           podpisaniNumber: 1,     //userObj.podpisaniNumber  =  + 1 
//         }

//      : userObj,
//  )

//  const  up = updatedUsers.map((userObj: any) => userObj._id === followUserId
//      ?      console.log('-------------измененный------Подписка юзер=', userObj.podpisaniNumber )
       
//      : userObj,
//  )


 const updatedUsers = users.map((userObj: any) => userObj._id === followUserId
          ? {
              ...userObj,
            followers: [...userObj.followers, {userId}], //в ...userObj.followers добавим userId
            }
          : userObj,
      );

      //console.log('Подписка followUserAction изм массив updatedUsers= ', updatedUsers.podpisaniNumber  );

     // console.log( 'клиент добавляет подписчика followUserAction updatedUsers=', updatedUsers)
      // update our users state
      dispatch({ type: 'getUsersSuccess', payload: updatedUsers, //измененный массив с добавленным подписчика
      });


      await axios.put( `${URI}/add-user`,  {followUserId , tokenfirebase },
        {  headers: { Authorization: `Bearer ${token}`, },   },
      );
      
    } catch (error) {
      console.log('Error following user:', error);
    }
  };

 // unfollow user - отписка от юзера
export const unfollowUserAction =
  ({userId, users, followUserId, tokenfirebase}: FollowUnfollowParams) =>
  async (dispatch: Dispatch<any>) => {
          
  //  console.log('unfollowUserAction userId= ', userId +'  users='+ users );
    try {
       const token = await AsyncStorage.getItem('token');
      
 const updatedUsers = users.map((userObj: any) => userObj._id === followUserId
          ? {
              ...userObj,
              followers: userObj.followers.filter(
                (follower: any) => follower.userId !== userId,
              ),
            }
          : userObj,
      );
// console.log( 'клиент отписывается от подписчика unfollowUserAction updatedUsers=', updatedUsers)
      // update our users state отписаться
      dispatch({ type: 'getUsersSuccess',   payload: updatedUsers,   });

      await axios.put( `${URI}/add-user`,  {followUserId,  tokenfirebase},
           { headers: { Authorization: `Bearer ${token}`, },  },
      );
    } catch (error) {
      console.log('Error following user:', error);
    }
  };

 

  // .addCase(getusertokenFirebase, (state, action:any) => {
   //   state.tokenfirebase = action.payload ;  //сам добавил токен полученный от Firebase
  //  })
//потом сделаем как сохранять токен в сторедж на компе
  export const usertokenFirebase = (tokenFirebase:string) => async (dispatch: Dispatch<any>) => {
    try {
     // dispatch({  type: 'userLogoutRequest', });
     
     // await AsyncStorage.setItem('user', '');
     //4-33-58 на
    // await AsyncStorage.setItem('token', '');
    console.log( 'эктив tokenFirebase=', tokenFirebase )
     dispatch({ type: 'getusertokenFirebase', 
                   payload: tokenFirebase,    });
  
    } catch (error) {
      console.error('Ошибка экшен  ', error);    
      
    }
  };
   