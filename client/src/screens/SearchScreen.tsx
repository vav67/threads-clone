import * as React  from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import  {useEffect, useState} from 'react';
 import {useDispatch, useSelector} from 'react-redux';
 import {  
   followUserAction,
    getAllUsers, unfollowUserAction, 
    } from '../../redux/actions/userAction';
  import Loader from '../common/Loader';

import tw from 'twrnc';
import axios from 'axios';
import { URI } from '../../redux/URI';
 
 

type Props = {
  navigation: any;
};

const SearchScreen = ({navigation}: Props) => {
 
const [data, setData] = useState( 
  [
    {
      name: '',
      userName: '',
    //  avatar: {url:""},//сам заменю пока на
      avatar: {url: 'https://cdn-icons-png.flaticon.com/128/568/568717.png'},
      followers: [],   //подписка
    },
  ]);

  const {users, user, isLoading, token } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

 //ненужно 5-06-25 const [users, setUsers] = useState<any>(null);
 //ненужно const [searchTerm, setSearchTerm] = useState(null);
 //4-39-13 выбираем token юзера 
 
 //getAllUsers()(dispatch);
 
 
//  useEffect(
//     () => {
//  // перенесли в экшен юзер const getAllUsers  

//        axios.get(`${URI}/users`,
//       {headers: {Authorization: `Bearer ${token}`}},  
//     // {headers: {'Content-Type': 'application/json'}},
//       ).then((res) =>{
//       //  console.log( 'data= ',res.data)
//         setUsers(res.data.users)   
//         setData(res.data.users)               
//       }
//       ) 
//           }, [ token // dispatch
//                   ]);
//в App добавил/ useEffect(() => {
//в App добавил/   //загружает всех пользователейиз базы данных через getAllUsers state.users
//в App добавил/           getAllUsers()(dispatch);
//в App добавил/ }, [dispatch]);

useEffect(() => {
         if (users) {
   console.log( '**************useEffect users=',users)       
          setData(users)
           }
}, [users  ]);


 //поиск
  const handleSearchChange = (e: any) => {

//const term = e          //.target.value
//setSearchTerm(term)
     if (e.length !== 0) {
const filteredUsers = 
     users && 
     users.filter(
    (i: any) => i.name.toLowerCase().includes(e.toLowerCase()),  );
    setData(filteredUsers)    //     setData(filteredUsers);
        } else {
  setData(data)  // setData(users);
      }
    
   };


  // console.log( 'tokenfirebase=', tokenfirebase)    

  //console.log( 'data=', data)    

  return (
    <>
    {isLoading ? (
      <Loader />
    ) : (
    <SafeAreaView>
                    <View style={tw`pl-3`}>
      <Text style={tw`text-black text-5 bg-[#707cec]`}>
      {user?.name}  это  SearchScreen </Text>
       </View>

    <View style={tw`p-3`}>
       <Text style={tw`text-8 text-[#000] font-600`}>Search</Text>
       <View style={tw`relative`}>
           <Image
            source={{
            uri: 'https://cdn-icons-png.flaticon.com/512/2811/2811806.png',
          }}
          height = {20}
          width = {20}
          style = {tw`absolute  top-5 left-2`}
                          />
        <TextInput
          onChangeText={e => handleSearchChange(e)} //отправим
          placeholder="Search"
          placeholderTextColor={'#000'}
          style={tw`w-full   bg-[#0000000e] rounded-6 pl-8 text-[#000]  mt-1`}
        />
      </View>
<FlatList 
   data={data} 

   showsVerticalScrollIndicator={false} // добавил 14-12-53
renderItem = {({item}) =>{
           //визуализируем элемент
//нажимаем на кнопку подписки ------------------            
 const handleFollowUnfollow = async (e: any) => {
              try {
                dispatch({ type: 'ppUser',  payload: "нажимаем на кнопку подписки " ,  });        
                //проверка совпадения айди
                if (e.followers.find((i: any) => i.userId === user._id)) {
                  await unfollowUserAction({  //отписка
                    userId: user._id,
                    users,
                    followUserId: e._id,
                    tokenfirebase: user.mytokenFirebase,  //сам (виртуал) передаем токен для оповещения
                  })(dispatch);
               //////////////////////////////////////////////////////////////////
  //  let probafe = "test@i.ua"
  //  axios.get( `${URI}/admin/${probafe}`,
  //  { headers: { Authorization: `Bearer ${token}` },  }
  //  ) 
//////////////////////////////////////////////////

                } else {
                  await followUserAction({   // подписка
                    userId: user._id, 
                    users,
                    followUserId: e._id,
                    tokenfirebase: user.mytokenFirebase,  //сам (виртуал)передаем токен для оповещения
                  })(dispatch);

              //////////////////////////////////////////////////////////////////
  //  let probafe = "test@i.ua"
  //  axios.get( `${URI}/admin/${probafe}`,
  //  { headers: { Authorization: `Bearer ${token}` },  }
  //  ) 
//////////////////////////////////////////////////             
                }
    } catch (error) {  console.log(error, 'error');  }
            };
//------------------------
return (
  <TouchableOpacity
    onPress={() =>
      navigation.navigate('UserProfile', {
        item: item,
      })
    }>
<View   style = {tw`flex-row my-3`}>

  
<Image source={{uri: item.avatar?.url}}
                height={30}
                width={30}
                borderRadius={100}
              /> 
 
       
  <View style={tw`w-[90%] flex-row justify-between border-b border-[#585555] pb-2`}>
       <View  >
         <Text style = {tw`pl-3 text-4 text-black `}>{item.name}</Text>
         <Text style = {tw`pl-3 text-4 text-black `}>{item.userName}</Text>
         <Text style = {tw`pl-3 mt-1 text-3 text-[#8a8585] `}>
          {item.followers?.length} followers подписчиков</Text>
       </View>
           <View>
   <TouchableOpacity
  style={tw`rounded-2  flex flex-row justify-center items-center py-2 w-[100px]
   border border-[#0000004b]` }
   onPress={() => handleFollowUnfollow(item)}
    >
        <Text style = {tw`text-black  `}>
              {
 item.followers?.find( (i: any) => i.userId === user._id, ) ? '+Following' : '+Follow'
          }     
         </Text>
       
     </TouchableOpacity>
       </View>  

  </View>
</View>

</TouchableOpacity>
 )

}} />



      </View>
        </SafeAreaView>

      )}
   </>
  );
};

export default SearchScreen