import * as React  from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  ScrollView ,
} from 'react-native';
 
import   {useEffect, useState} from 'react';
import {getNotifications} from '../../redux/actions/notificationAction';
import {useDispatch, useSelector} from 'react-redux';
import { StatusBar } from 'native-base';

import getTimeDuration from '../common/TimeGenerator';

 import axios from 'axios';
 import {URI} from '../../redux/URI';

  import Loader from '../common/Loader';

import tw from 'twrnc';
 


type Props = {
  navigation: any;
};

const NotificationScreen = ({navigation}: Props) => {

  const dispatch = useDispatch();


  const {notifications, isLoading} = useSelector(
   (state: any) => state.notification,
  );
 // const [refreshing, setRefreshing] = useState(false);
  const {posts} = useSelector((state:any) => state.post);

  const {token, users, pproba} = useSelector((state: any) => state.user);
 



 
const [active, setActive] = useState(0);
  //const refreshingHeight = 100;

  const labels = ['All', 'Replies', 'Mentions'];

   const handleTabPress = (index: number) => {
     setActive(index);
   };

  //первоначально
  useEffect(() => {
    getNotifications()(dispatch);
  }, []);
  
  
 


  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>

      <SafeAreaView>
   
      <View style={tw`pl-3`}>
      <Text style={tw`text-black text-5 bg-[#707cec]`}>
               это   NotificationScreen   </Text>
       </View>



   <StatusBar 
   animated={true}
   backgroundColor={"#61dafb"}
   barStyle={ 'dark-content'}
   showHideTransition={ 'fade'}
       />

<ScrollView> 
  
          <View style = {tw`p-3`}>
      <Text style = {tw` text-black text-3xl font-700`}> Activity</Text>
      <Text style = {tw`text-black text-4 font-400`}> это кто на меня подписан</Text>

      <View style = {tw`w-full flex-row my-3 justify-between`}>
                {labels.map((label, index) => (
                  <TouchableOpacity
                    key={index}
        style={[{ width: 105,  height: 38, borderRadius: 8  }, 
       {backgroundColor: active === index ? 'black' : '#fff'},
       {borderWidth: active === index ? 1 : 0}, 
       {borderColor: 'rgba(0,0,0,0.29)' }          ]}      
                   onPress={() => handleTabPress(index)}
             >
                    <Text
    style = {tw`
         ${ active !== index ? 'text-black' :'text-[#fff]' } 
         ${ active !== index ? 'border-4 border-[#1a970f] rounded-2 ' :'border-[#f2f8f2]   ' }
          text-5 font-600 text-center pt-1`} >
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>


              {/* All activites 
      {active === 0 &&*/}
      
      {notifications.length === 0 && (
        <View style = {tw`w-full h-[80px] flex items-center justify-center`}>
                  <Text style = {tw`text-[16px] text-black mt-5`}>
                    You have no activity yet! У вас пока нет активности</Text>
                </View>
              )}

              {/* All Replies */}
              {active === 1 && (
                <View style = {tw`w-full h-[80px] flex items-center justify-center`}>
                  <Text style = {tw`text-[16px] text-black mt-5`}>
                  You have no replies yet!У вас пока нет ответов</Text>
                </View>
              )}

              {/* All Replies */}
              {active === 2 && (
                <View style = {tw`w-full h-[80px] flex items-center justify-center`}>
                  <Text style = {tw`text-[16px] text-black mt-5`}>
                    You have no mentions yet! У вас пока нет упоминаний</Text>
                </View>
              )}



   {active === 0 && (

 <FlatList
          data={notifications}
  renderItem={({item}) => {
                  
  //-     const [userInfo, setUserInfo] = useState({ //13-30-30
  //-   name: '',
  //-   avatar: {
  //-     url: 'https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png',
  //-   },
  //- });
         const time = item.createdAt;
          //Дата    
                  const formattedDuration = getTimeDuration(time);
//функция      
        const handleNavigation = async (e: any) => {
          const id = item.creator._id;

    await axios.get(`${URI}/get-user/${id}`, {
              headers: {Authorization: `Bearer ${token}`},
            })
              .then(res => {
                 if(item.type === "Follow"){
                navigation.navigate('UserProfile', {
                  item: res.data.user,
                });
              } else{
                navigation.navigate('PostDetails', {
                  data: posts.find((i:any) => i._id === item.postId)
                });
                  }
            });

        } //конец функции
//13-30-24
//-  useEffect(() => {
//-           axios
//-            .get(`${URI}/get-user/${item.user._id}`, {
//-                headers: {Authorization: `Bearer ${token}`},
//-              })
//-              .then(res => {
//-               //-  setUserInfo(res.data.user)
//-                       })
//-        }, []);



    return (

           <TouchableOpacity onPress={() => handleNavigation(item)}>
                  <View style = {tw`flex-row`} key={item._id}>
                    {/* <View className="relative">*/}
                  
                      <Image 
               source={{ uri:    // item?.creator.avatar.url
                            users.find(  //13-32-15
             (user: any) => user._id === item.creator._id,
                            )?.avatar.url,
                        }}
                        width={40}
                        height={40}
                        borderRadius={100}
                      />

                     {
                     item.type === 'Like' && ( 
                              <View   
           style = {tw`absolute bottom-5 border-[2px] border-[#fff] right-2
           h-[25px] w-[25px] bg-[#eb4545] 
           rounded-full items-center justify-center flex-row`}             
                        
                        >       
                          <Image
                            source={{
                              uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png',
                            }}
                            tintColor={'#fff'}
                            width={15}
                            height={15}
                        />  
                  </View>
                          )}

             {
                     item.type === 'Follow' && ( 
                              <View   
           style = {tw`absolute bottom-5 border-[2px] border-[#fff] right-2
           h-[25px] w-[25px] bg-[#3d27fd] 
           rounded-full items-center justify-center flex-row`}             
                        
                        >       
                          <Image
                            source={{
     uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
                            }}
                            tintColor={'#fff'}
                            width={12}
                            height={12}
                        />  
                  </View>
                          )}       

  {/*  КОГДА ПОДПИСАЛСЯ  */}                      
    <View style = {tw`pl-3 my-2`}>
        <View style = {tw`flex-row w-full items-center border-b pb-3
                        border-[#0000003b]`}>
           <View style = {tw`w-full`}>
                 <View style = {tw`flex-row items-center`}>
<Text style = {tw`text-5 text-black font-600`}> {item.creator.name} </Text>
<Text style = {tw`pl-2 text-4 text-black font-400`}> {formattedDuration}  </Text>
                    </View>
<Text style = {tw` text-4 text-black font-400`}> {item.title}  </Text>
               </View>
           </View>
       </View>
   
   
   
               </View>
              </TouchableOpacity>

     //конец внутр return 
           )  
           
  
         }}
           //конец FlatList
           />  
          
            )
           }
  
           </View>

            
           
           <View style={tw`pl-3`}>
          
      <Text style={tw`text-black text-5 bg-[#707cec]`}>
               In pproba  </Text>
               

               {pproba &&
              pproba.map((iptem:any, ii:number) => (
                
                <Text style={tw`text-black text-5 bg-[#707cec]`}   key={ii} >
                =={iptem} </Text>
            
            
              ))}
           
          <Text style={tw`text-black text-5 bg-[#707cec]`}>---------------------</Text>
      
       </View>
       



</ScrollView>

      </SafeAreaView>

      </>
      )}
    </>

  )
}

export default NotificationScreen