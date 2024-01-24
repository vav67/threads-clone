import * as React  from 'react';
 import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
 
import {useDispatch, useSelector} from 'react-redux';
import {
  followUserAction,
  unfollowUserAction,
} from '../../redux/actions/userAction';
import tw from 'twrnc';


type Props = {
  route: any;
  navigation: any;
};

const PostLikeCard = ({navigation, route}: Props) => {
  
  const data = route.params.item;
  console.log( 'data=', data )
 const {user, users, } = useSelector((state: any) => state.user);
    const dispatch = useDispatch();






  return (
    <SafeAreaView>
      <View style={tw`p-3`}>
      <View style={tw`pl-3`} >
      <Text style={tw`text-black text-5 bg-[#707cec]`}>
         {user?.name}      --это   комп-т PostLikeCard  </Text>
       </View>


        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/512/2223/2223615.png',
              }}
              height={25}     width={25}      />
          </TouchableOpacity>
  <Text style={tw`pl-3 text-[20px] font-[600] text-[#000]`}>
               Likes</Text>
        </View>  
         
 <FlatList
          data={data}
   renderItem = {({item}) => {  //пройдемся по лайкам
             //визуализируем элемент
//нажимаем на кнопку подписки ------------------     
    //ф-я 
    const handleFollowUnfollow = async (e: any) => {
      try {
        if (e.followers.find((i: any) => i.userId === user._id)) {
          await unfollowUserAction({
            userId: user._id,
            users,
            followUserId: e._id,
tokenfirebase: user.mytokenFirebase,  //сам передаем токен для оповещения     
          })(dispatch);
        } else {
          await followUserAction({
            userId: user._id,
            users,
            followUserId: e._id,
tokenfirebase: user.mytokenFirebase,  //сам передаем токен для оповещения            
          })(dispatch);
        }
      } catch (error) {
        console.log(error, 'error');
      }
    };
//----------------------------------------------    
      
    
    return (    
             <TouchableOpacity
                style={tw`w-full py-3 flex-row justify-between`}
                onPress={() =>   item.userId === user._id
                    ? navigation.navigate('Profile')
                    : navigation.navigate('UserProfile', {
     item: users.find((i: any) => i._id === item.userId ? i : null, ),
                      })  }>
                 <View style={tw`flex-row`}>
                 <Image
                   source={{uri: item.userAvatar}}
                    width={40}
                   height={40}
                     borderRadius={100}
                  />
                 <View style={tw`pl-3`}>
                    <View style={tw`relative flex-row items-center`}>
                  <Text style={tw`text-[18px] text-black`}>
                 {item?.name ? item.name :  'пустое '+ user.name} 
                     </Text>
                   {/* {item.userId === '64ba059336147d4b13bc1a6e' && (
                       <Image
                       source={{
                           uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828640.png',
                         }}
                       width={15}
                         height={15}
                        style={tw`ml-1`}
                      />
                    )} */}
                       </View>  
                    
                   <Text style={tw`text-[16px] text-[#000000ba]`}>
                    {item?.userName ? item.userName :  'пусто '+ user.name // user.userName
                                }
                     </Text>
                   </View>
               </View> 
                
                {user._id !== item.userId && ( 
                 <TouchableOpacity
         style={tw`rounded-[8px] w-[100px] flex-row justify-center items-center
                    h-[35px] border border-[#0000004b]`}
      onPress={() => handleFollowUnfollow( // изменяем подписку
           users.find((i: any) => i._id === item.userId ? i : null, ),
                    )}
                  >
         <Text style={tw`text-black`}> {
  users.find((i: any) => item.userId === i._id &&
        i.followers.find((i: any) => i.userId === user._id), 
                ) ? 'Following'
                  : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                 )}   
             </TouchableOpacity>
             
        )
           
             }} 
      
        /> 
                
      </View>
    </SafeAreaView>
  );
};

export default PostLikeCard;
