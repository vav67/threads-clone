import * as React  from 'react';
import   { useEffect, useState } from 'react';

import messaging , { FirebaseMessagingTypes } from '@react-native-firebase/messaging' //для сообщений
//сообщения отображ на экране
import PushNotification from "react-native-push-notification"

import {Button,  Alert,  Text,  PermissionsAndroid, Platform} from 'react-native'
 
import {NavigationContainer} from '@react-navigation/native';
import Main from "./Navigations/Main";
import Auth from "./Navigations/Auth";

//import Store from './redux/Store';
//import { Provider } from 'react-redux';

import { useDispatch, useSelector} from 'react-redux';

import { SoobSubscribe, getAllUsers, loadUser, usertokenFirebase } from './redux/actions/userAction';

//import {StatusBar} from 'native-base';
import tw from 'twrnc';


import Loader from './src/common/Loader';
import {LogBox} from 'react-native';
import { URI } from './redux/URI';
import axios from 'axios';
import { SoobLike, getAllPosts } from './redux/actions/postAction';
import AsyncStorage from '@react-native-async-storage/async-storage';

//блокирует предупреждения 13-56-54
LogBox.ignoreAllLogs()


const checkApplicationPermission = async () => {
  
  if ( Platform.OS ===  'android' ) {
     try {
     await PermissionsAndroid.request(
       PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

     } catch (error) {}
  }
}






function App() {

  const {isAuthenticated, isloading, loading, pproba, myfirebasetoken,
     user, users, token } = useSelector((state: any) => state.user);
  
  const [ddata, setDdata] = useState({}) //лайк
  const [datapodpiska, setDatapodpiska] = useState({}) //подписка

  const dispatch = useDispatch()

  const ww = (data:any )  => {
  /////  getAllPosts()(dispatch) 
    if (posts.length > 0) {  //если посты есть
      console.log( '-@@@@ -SoobLike--постов=', posts.length)
    SoobLike({ data, posts })(dispatch); 
    } else
    {
   console.log("==@@ ww===== будем загружать посты")
    getAllPosts()(dispatch) 

    }
  }

  const subscribe = (datapodpiska:any) => {
//про подписку

SoobSubscribe({ datapodpiska, user, users  })(dispatch); 

  }



  useEffect(() => { //сообщение лайк
    console.log( '*@@@@@@@@ ---Изменилась data=',ddata )
    dispatch({ type: 'ppUser',  payload: "сработало ЛАЙК"  });
    ww(ddata )
    },[ddata]) 

    useEffect(() => { //сообщение о подписке
      console.log( '*@@@@@@@@ ---Изменилась datapodpiska=',datapodpiska )
      dispatch({ type: 'ppUser',  payload: "сработало ОПОДПИСКЕ" ,  });
      subscribe(datapodpiska )
      },[datapodpiska]) 

 
 const {posts} = useSelector((state: any) => state.post);
 //const {isAuthenticated, isloading, loading, pproba, myfirebasetoken, user, users, token} = useSelector((state: any) => state.user);

 
//спрашиваем разрешения оповещения
  useEffect(() => { 
//создаем канал для отображения сообщения
  PushNotification.createChannel(
    {
      channelId:  'ka-01', // 'default-channel-id', // Уникальный идентификатор канала
      channelName: 'channelka',//'Default channel', // Имя канала
      channelDescription: 'A default channel', // Описание канала
      soundName: 'default', // Звук уведомлений (необязательно)
      importance: 4, // Важность канала (от 0 до 5)
    },
    created => console.log(`createChannel returned '${created}'`), // Callback после создания канала
  );


    checkApplicationPermission()
  },[] )

 



 
//получаем сообщение
  const getPushData =async (remoteMessage:any) => {

   const { notification, data } = remoteMessage;
   
   dispatch({ type: 'ppUser',  payload: "пришло---"+ notification.title ,  });

 if (notification.title === 'ЛАЙК' ) {
  setDdata(data)  
  console.log( '--- ПРИШЕЛ СООБЩЕНИЕ ---- постов=', posts.length)
 }
 
 if (notification.title === 'ПОДПИСКА' ) {
  setDatapodpiska(data)  
  console.log( '--- ПРИШЕЛ СООБЩЕНИЕ ---- ПОДПИСКА')
 }
 

    //мы можете сформировать нотификацию    
  PushNotification.localNotification({
      channelId: 'ka-01', //'fcm_fallback_notification_channel',
        message:   notification.body,
        title:  notification.title,
   
      //  icon: 'https://cdn-icons-png.flaticon.com/512/3917/3917688.png',
        color: '#c35555'
   //  priority: "high",
      // soundName: 'default',
    // //  vibrate: true, 
      //playSound:true
    })
   
  }

 
  // получим токен
  // перенсли  const getToken = async() => {
  // перенсли     const tokenFirebase = await messaging().getToken()
  // перенсли  //передаем на проверку
  // перенсли   usertokenFirebase(tokenFirebase)(dispatch);
  // перенсли      console.log("======Firebase-Token =", tokenFirebase)
  // перенсли   }


  useEffect(() => { 
   // перенсли   getToken() //получаем токен
   // сервис, который будет отвечать за прием сообщений   
     const unsubMessaging = messaging().onMessage(getPushData)
//сообщение
  ///    messaging().onNotificationOpenedApp(remoteMessage => {
 ///       console.log( 'remoteMessage-noti=', remoteMessage.notification)
  ///    })
  return () => {  unsubMessaging()  } 
   },[]) 


//--------через useEffect --------------------------------------------------
useEffect(() => { 

  if (isAuthenticated)
  {
    
    console.log( myfirebasetoken,
      '= myfirebasetoken ---АВТОРИЗАЦИЯ----user.mytokenFirebase=',
                 user.mytokenFirebase)  

   const getToken = async() => {
      const ttokenFirebase = await messaging().getToken()
    console.log("==тогда получили ====Firebase-Token =", ttokenFirebase)
  usertokenFirebase(ttokenFirebase, user.name, user.userName, user.bio)(dispatch);
  
   }
 
//Это условие проверяет, что myfirebasetoken не является undefined и не равен null, 
//и только затем сравнивает его с user.mytokenFirebase

   if (myfirebasetoken !== undefined && myfirebasetoken !== null && myfirebasetoken !== user.mytokenFirebase) {
    console.log(myfirebasetoken, '= myfirebasetoken!!==авторизован (несовпад) ===user.mytokenFirebase=', user.mytokenFirebase);
    getToken(); // Получаем токен
  }

 

  }

}, [isAuthenticated]);

 
 
 
   return (
  
    <AppStack />
  
    );
 
}



// return (
//   <Provider store={Store}>
//     <AppStack />
//   </Provider>
// );



 const AppStack = () => {

 ////  const [isLogin, setIsLogin] = React.useState(false);
     const {isAuthenticated,   loading, pproba, 
                   myfirebasetoken,
          user, token } = useSelector((state: any) => state.user);
  const dispatch =useDispatch()
 

  ///////-----  console.log( isAuthenticated,'=isAuthenticated ( ИТАК ВНАЧАЛЕ)   1App  token=', token) 

//   React.useEffect(() => {
//  //  Store.dispatch(loadUser());
//      loadUser()(dispatch)       
 
//    getAllUsers()(dispatch) // здесь state.isLoading = true в false

//   }, [ ]);
 
 
// React.useEffect(() => {
//333   useEffect(() => {
//   //  Store.dispatch(loadUser());
//   //console.log('-------------запускаю  loadUser() ')     
//  //2222222  loadUser()(dispatch)       
//    ///////-----     console.log('-------------запускаю getAllUsers() ')
//   ///////-----  getAllUsers()(dispatch) // здесь state.isLoading = true в false
 
//    }, [ ]);






 ///////-----   console.log(isAuthenticated ,'=isAuthenticated (  2ДАЛЕЕ  ) loading=', loading)

  //console.log( '&&&&===========App==== myfirebasetoken=', myfirebasetoken) 

 return (
  <>


   { (loading) ? (
   <>
       <Text  style={tw`text-[#f3f3f3]`}> Loading   </Text>
       <Text  style={tw`text-black`}> Добавить таймер попыток соединения </Text>
         <Loader />
     </>      
    ) : (
      <>
      
        {isAuthenticated ? (
          <NavigationContainer>
            <Main />
          </NavigationContainer>
        ) : (
          <NavigationContainer>
            <Auth />
          </NavigationContainer>
        )}
      </>
    )}
  </>
);



  };

export default App;
//  <Main /> {/* на главный экран */}
//  <Auth /> {/* если не рошел аутенфикацию */}