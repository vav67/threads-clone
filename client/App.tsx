import * as React  from 'react';
import   { useEffect } from 'react';

import messaging , { FirebaseMessagingTypes } from '@react-native-firebase/messaging' //для сообщений
//сообщения отображ на экране
import PushNotification from "react-native-push-notification"

import {Button,    Text,  PermissionsAndroid, Platform} from 'react-native'
 

import {NavigationContainer} from '@react-navigation/native';
import Main from "./Navigations/Main";
import Auth from "./Navigations/Auth";

 
//import Store from './redux/Store';
//import { Provider } from 'react-redux';

import { useDispatch, useSelector} from 'react-redux';


import { getAllUsers, loadUser, usertokenFirebase } from './redux/actions/userAction';

//import {StatusBar} from 'native-base';
import tw from 'twrnc';


import Loader from './src/common/Loader';
import {LogBox} from 'react-native';

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

 // console.log("----------------App")

  const dispatch = useDispatch()

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
//спрашиваем разрешения оповещения
  useEffect(() => { 
    checkApplicationPermission()
  },[] )



//получаем сообщение
  const getPushData =async (remoteMessage:any) => {
 
    const { notification, data } = remoteMessage;
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
   // console.log( 'remoteMessage=', remoteMessage)
  }

///  messaging().onMessage(getPushData)

  // получим токен
const getToken = async() => {

  const tokenFirebase = await messaging().getToken()

 //передаем на проверку
 usertokenFirebase(tokenFirebase)(dispatch);

   console.log("======Firebase-Token =", tokenFirebase)
 }


  useEffect(() => { 
     getToken() //получаем токен

   // сервис, который будет отвечать за прием сообщений   
     const unsubMessaging = messaging().onMessage(getPushData)

//сообщение
  ///    messaging().onNotificationOpenedApp(remoteMessage => {
 ///       console.log( 'remoteMessage-noti=', remoteMessage.notification)
  ///    })
 
  return () => {  unsubMessaging()  } 
   },[]) 


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
   const {isAuthenticated, isloading, loading, pproba} = useSelector((state: any) => state.user);
   const dispatch =useDispatch()

 // console.log( isAuthenticated,'=isAuthenticated ( ИТАК ВНАЧАЛЕ)   1App  isloading=', isloading) 

  React.useEffect(() => {
 //  Store.dispatch(loadUser());
     loadUser()(dispatch)       
 
   getAllUsers()(dispatch) // здесь state.isLoading = true в false

  }, [ ]);
 



 // console.log(isAuthenticated ,'=isAuthenticated (  2ДАЛЕЕ  ) loading=', loading)

 // console.log( '===========App==== isloading=', isloading) 

 return (
  <>
    {/* <>
      <StatusBar
        animated={true}
        backgroundColor={'#fff'}
        barStyle={'dark-content'}
        showHideTransition={'fade'}
      />
    </>    {isloading ? (  */
   //   {(isloading !== false) ? (  
    }

   { (loading) ? (
   <>
       <Text  style={tw`text-black`}> Loading = {pproba} </Text>
       <Text  style={tw`text-black`}> Добавить таймер попыток соединения </Text>
         <Loader />
     </>      
    ) : (
      <>
      <Text  style={tw`text-black`}> pp = {pproba} </Text>
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