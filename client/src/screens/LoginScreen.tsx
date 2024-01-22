import * as React  from 'react';
import {useEffect, useState} from 'react';

import { View, Text, 
  TouchableOpacity, TextInput, 
  ToastAndroid, 
  Alert} from 'react-native'

import {loadUser, loginUser} from '../../redux/actions/userAction';
import {useDispatch, useSelector} from 'react-redux';

import tw from 'twrnc';
import axios from 'axios';

type Props = {
  navigation: any
}

const LoginScreen = ({navigation}: Props) => {

//получим данные выборка юзера - ошибка или уутинфицирован
  const {error, isAuthenticated} = useSelector((state: any) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const submitHandler = (e: any) => {
   //передаем на проверку
    loginUser(email, password)(dispatch);
   
  //  ToastAndroid.showWithGravity(
  //   "тест Login successfull!!",
  //   ToastAndroid.LONG,
  //   ToastAndroid.BOTTOM,
  //  )
  };

  const subb = (e: any) => {
   // Alert.alert('Login successful!')
     axios.get(`https://threads-clone-plum-one.vercel.app/api/proba`, {
    //axios.get(`http://192.168.31.85:8000/api/proba`, {
      //  headers: {Authorization: `Bearer ${token}`},
     headers: {'Content-Type': 'application/json'},
    }).then((res) =>{
      //       //  console.log( 'data= ',res.data)
      Alert.alert('версия='+ JSON.stringify(res.data))
    dispatch({ type: 'ppUser',  payload: "версия=" + JSON.stringify(res.data)});  
    }
             )
   
  


  }



// только  вначале выполняется  при изменении error или аутинфикации
  useEffect(() => {
    // если ошибка при логине
    if (error) {
      // if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Email and password not matching!',
          ToastAndroid.LONG,
        );
      // } else {
      //   Alert.alert('Email and password not matching!');
      // }
    }
    if (isAuthenticated) {
    // если аутенфицирован  
   loadUser()(dispatch); ///14-12-03/////
 navigation.navigate("HomeScreen")
    //  if (Platform.OS === 'android') {
      ToastAndroid.show('Login successful!', ToastAndroid.LONG);
    //  } else{
    //    Alert.alert('Login successful!');
    //  }
   


    }
  }, []);
  /////14-12-03//////////}, [isAuthenticated, error]);






  return (
 <View style={tw`flex-1 items-center justify-center bg-white`}>

     <View   style={tw`w-70% `} >
  <Text  style={tw`text-5xl font-bold    my-8 text-center text-black`} >
      Login
  </Text>
  <TextInput
    placeholder="Enter your email"
   value={email}
    //placeholderTextColor={'#000'}
     onChangeText={text => setEmail(text)}
  style={   tw` w-full  text-[20px]  border border-2   rounded-md  px-2 py-1   my-2 mb-4   text-black`
  //  tw`w-full h-35px rounded-3 border  border-2 border-green-300  bg-white  px-2 my-2 mb-4 `
  }
    
  />
  <TextInput
    placeholder="Enter your password"
    style={tw`w-full  text-[20px]  border border-2   rounded-md  px-2 py-1   my-2 mb-4   text-black`}
     value={password}
  //  placeholderTextColor={'#000'}
  onChangeText={text => setPassword(text)}
     secureTextEntry={true}
  />
  <TouchableOpacity  style={tw`mt-6 `}    >
    <Text
    style={tw`w-full  font-medium   text-white  text-center rounded-md  p-2  bg-black`}  
      
      onPress={submitHandler}
    >
      Login
    </Text>
    </TouchableOpacity>

    <TouchableOpacity  style={tw`mt-6 `}    >
    <Text
    style={tw`w-full text-[20px]  font-medium   text-white  text-center rounded-md  p-2  bg-black`}  
      
      onPress={subb}
    >
      Версия
    </Text>

   
  </TouchableOpacity>
  <Text  style={tw`pt-3 text-black`}  
   onPress={() => navigation.navigate('Signup')}  >
    Don't have any account? <Text>Sign up</Text>
  </Text>
</View>
</View>

  )
}

export default LoginScreen