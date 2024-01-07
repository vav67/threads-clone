import { View, Text, TouchableOpacity,
   TextInput, ToastAndroid,
    Alert, Image
   } from 'react-native'
   import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
import tw from 'twrnc';

import { registerUser} from '../../redux/actions/userAction';


type Props = {
  navigation: any
}

const SignupScreen = ({navigation}: Props) => {
 
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
   const [avatar, setAvatar] = useState( '' );
   //это сам тру если была нажата кнопка регистрации
   const [samup, setSamup] = useState( false );


const dispatch = useDispatch();
  
  //получим данные выборка юзера - ошибка или уутинфицирован
const {error, isAuthenticated} = useSelector((state: any) => state.user);

// только  вначале выполняется  при изменении error или аутинфикации
useEffect(() => {
  if (samup) { 
  
    if (error) {
    // if(Platform.OS === 'android'){
    //   ToastAndroid.show(error, ToastAndroid.LONG);
    // } else{
      Alert.alert("--- Ошибка " + error);
   // }
  }
  //Alert.alert("Acc= " + error + '==' + isAuthenticated );
   if (isAuthenticated) {
    Alert.alert("Account Creation Successful!"  );
    //отправим на главный экран
    navigation.navigate("Home")
    // loadUser()(dispatch);
   }

  }
}, [ error  , isAuthenticated ]     );


  //загрузим аватар
  const uploadImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.8,
      includeBase64: true,
    }).then((image: ImageOrVideo | any   ) => {
      if (image) {
      //  console.log( 'фото=', image) есть data - поток цифр
        //тогда загрузим изображение
        // login ()
        setAvatar('data:image/jpeg;base64,' + image.data);
      } else {
        setAvatar('');
      }
    });
  };

  //console.log( 'avatar=', avatar)

  const submitHandler = (e: any) => {
   // loginUser(email, password)(dispatch);

   //Alert.alert("тест Login successfull!! aply")
   registerUser(name, email, password, avatar)(dispatch);
  //  ToastAndroid.showWithGravity(
  //   "тест Login successfull!!",
  //   ToastAndroid.LONG,
  //   ToastAndroid.BOTTOM,
  //  )

  setSamup(true) // кнопка сработала 
  };


 


  return (
 <View style={tw`flex-1 items-center justify-center bg-white`}>

<View style={tw`pl-3`} >
      <Text style={tw`text-black text-5 bg-[#707cec]`}>
            --это   экран  SignupScreen  </Text>
       </View>


     <View   style={tw`w-70% `} >
  <Text  style={tw`text-5xl font-bold mb-6 text-center text-black`} >
     Sign Up
  </Text>
  <TextInput
    placeholder="Enter your name"
   value={name}
     placeholderTextColor={'#778394'}
     onChangeText={text => setName(text)}
  style={tw`w-full h-35px rounded-3 border  border-2 border-green-300  bg-white  px-2 my-2 mb-4   `}
    
  />
  <TextInput
    placeholder="Enter your email"
    style={tw`w-full h-35px border border-2   rounded-md  px-2 my-2 mb-4  text-black`}
     value={email}
   placeholderTextColor={'#888383'}
  onChangeText={text => setEmail(text)}
    // secureTextEntry={true}
  />

<TextInput
    placeholder="Enter your password"
    style={tw`w-full h-35px border border-2   rounded-md  px-2 my-2 mb-4  text-black`}
     value={password}
        placeholderTextColor={'#000'}
  onChangeText={text => setPassword(text)}
     //secureTextEntry={true}
  />

<TouchableOpacity
style={tw`flex-row items-center `} 
          onPress={uploadImage}
          >
           <Image
            source ={{   
            
   uri: avatar ? avatar  : 'https://cdn-icons-png.flaticon.com/128/568/568717.png',
            }}
            
            style={tw`w-30px h-30px rounded-full `} 
          /> 
   <Text style={tw`text-black pl-2 `}  >upload image</Text>
        </TouchableOpacity>





  <TouchableOpacity  style={tw`mt-6 `}    >
    <Text
    style={tw`w-full  font-medium   text-white  text-center rounded-md  p-2  bg-black`}  
      
      onPress={submitHandler}
    >
     Sign Up
    </Text>
   
  </TouchableOpacity>
  <Text  style={tw`pt-3 text-black`}  
   onPress={() => navigation.navigate('Login')}  >
    Already have an account? <Text>Sign in</Text>
  </Text>
</View>
</View>

  )
}

export default SignupScreen

 