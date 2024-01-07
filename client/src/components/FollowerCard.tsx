import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
  import {useDispatch, useSelector} from 'react-redux';
import {
  followUserAction,
  loadUser,
  unfollowUserAction,
} from '../../redux/actions/userAction';

import tw from 'twrnc';


type Props = {
  route: any;
  navigation: any;
};

const FollowerCard = ({navigation, route}: Props) => {
  //console.log( 'params=', route.params)
  //const item = route.params.item;
  //const item = route.params.followers;
 
   const followers = route.params.followers;
   const following = route.params.following;  

 const [data, setData] = useState( followers); //item) //
 //попробую заменить чтоб сразу срабатывал
 //const [data, setData] = useState( []);


  const [active, setActive] = useState(0);
    
  const {user, users, isLoading} = useSelector((state: any) => state.user);

  const dispatch = useDispatch();

// if (data.length === 0 ) {
//   console.log('1 да--вначале--data=', data)
//   setData(followers);
// } else {
//  console.log('1- нет -вначале--data=', data )

// }

 

  //console.log( following,'===following-------------------followers=', followers)

 console.log( '---------вначале ----users=', users, 
 '  --------followers=' + followers,
  ' -------- following=' + following,  
  ' -------- active=' + active )

 


    useEffect(() => {
   // console.log( user._id ,'=iduser------item=', item)
//       if (item) {
//       //выбираем фильтром из итемов ?????????????????
//   //some() проверztv, выполняется ли заданное условие хотя бы один раз    
//    const fullUsers = users.filter(
//   (user: any) =>item.some((item:any) => item.userId === user._id)
//      )
// setData(fullUsers);      
//       } 
        
//console.log( '--useEffect---FollowerCard-----users=', users)

  if (users) {
     if (followers) {
      //console.log( '--useEffect---FollowerCard--followers=', followers)   
       //  const updatedUsers = [...users, user];
       //const fullUsers = updatedUsers.filter((user: any) =>
      const fullUsers = users.filter((user: any) =>
       followers.some((item: any) => item.userId === user._id),);
     setData(fullUsers);
             }

      if (active === 1) {
    if (following) {
      //console.log( '--useEffect---FollowerCard--following=', following)

       //  const updatedUsers = [...users, user];
       const fullUsers = users.filter((user: any) =>
         following.some((item: any) => item.userId === user._id), 
         );
        setData(fullUsers);
          }
                       }
    }
   
  }, [followers, following, active, users   ]); //[item] )   //


  // console.log('2----data=', data)
 // console.log('2------prob=', prob)

  return (
    <SafeAreaView>
                  <View style={tw`pl-3`}>
      <Text style={tw`text-black text-5 bg-[#707cec]`}>
      {user?.name}  это FollowerCard  </Text>
       </View>

      <View style={tw`p-3 relative mb-2`}> 
       
     <View style={tw`flex-row items-center`}> 
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source= {{
                uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png',
              }}
              height={25}
              width={25}
            />
          </TouchableOpacity>
          <Text style={tw`pl-3 text-[20px] font-600 text-[#000]`}> 
            {    user.name     //   item?.name
                 }
          </Text>
          {/* <Text style={tw`pl-3 text-[20px] font-600 text-[#000]`}> 
            {   } {data[0]?._id  }{ }проба-{ prob[0]?._id      //   item?.name
                 } 
          </Text> */}
        </View>  

    <View style={tw`w-[100%] pt-5 m-auto flex-row justify-between`}> 
          <TouchableOpacity onPress={() => setActive(0)}>
       <Text  style={tw`text-5 pl-1 text-[#000]  
              ${ active === 0 ? 'opacity-100' :'opacity-40' }  `}
                   >  Followers         </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActive(1)}>
        <Text    style={tw`text-5 pl-1 text-[#000]   
             ${ active === 1 ? 'opacity-100' :'opacity-40' }   `}
                  > Following          </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setActive(2)}>
        <Text  style={tw`text-5 pl-1 text-[#000]   
           ${ active === 2 ? 'opacity-100' :'opacity-40' }   `}
                > Pending             </Text>
          </TouchableOpacity>
        </View>  
 


    {active === 0 ? ( // подчеркивание табов
    <View style={tw`w-[40%] absolute h-[1px] bg-black left-[-10px] bottom-0`} />
     ) : active === 1 ? (
     <View style={tw`w-[30%] absolute h-[1px] bg-black right-[31%] bottom-0`} />
      ) : (
          <View style={tw`w-[32%] absolute h-[1px] bg-black right-[0%] bottom-0`} />
        )}
    </View> 
 
    {active === 0 && ( // какой таб нажат
      <Text style={tw`py-2 text-center text-black text-[16px]`}> 
     {followers?.length} followers подписчики
        </Text>
      )}  
  
    {active === 1 && (
        <Text style={tw`py-2 text-center text-black text-[16px]`}> 
          {following?.length} following на кого подписан
        </Text>
      )}   

     {active !== 2 && (   // кроме третьего таба
      
       <FlatList
          data={data}
          renderItem={({item}) => {  //пройдемся по нравиться
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
                  })(dispatch);
                } else {
                  await followUserAction({
                    userId: user._id,
                    users,
                    followUserId: e._id,
                  })(dispatch);
                }
              } catch (error) { 
                console.log(error, 'error');
              }
              loadUser()(dispatch);
            };
//---------------------------------------------
       return (
              <TouchableOpacity
          style={tw`w-[95%] m-auto py-3 flex-row justify-between`}
     onPress={  () => navigation.navigate('UserProfile', { item, })  }
                  >
           <View style={tw`flex-row`}> 
               <Image //сам заменил картинку если ее нету uri: item.avatar?.url
                    source={{ uri:
                      item.avatar?.url ?   item.avatar.url :
                     'https://cdn-icons-png.flaticon.com/512/2961/2961937.png'
                      }}          
                   width={40}
                    height={40}
                    borderRadius={100}
                  />    
                  <View style={tw`pl-3`}> 
                    <View style={tw`flex-row items-center relative`}> 
                      <Text style={tw`text-[18px] text-black`}> 
                        {item?.name}
                      </Text>
             {item.role === 'Admin' && (
                        <Image
                          source={{
                            uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828640.png',
                          }}
                          width={15}
                          height={15}
                          style={tw`ml-1`}
                        />
                      )}

                    </View>
                    <Text style={tw`text-[16px] text-[#000000ba]`}> 
                      {item?.userName}
                    </Text>
                  </View>
                </View>  
     {user._id !==  item.userId && (  //item._id && (
                  <TouchableOpacity
      style={tw`rounded-[8px] w-[100px] flex-row justify-center items-center 
              h-[35px] border border-[#0000004b]`}
              
  onPress={() => handleFollowUnfollow(item)}>
                    <Text style={tw`text-black`}> 
         {item?.followers?.find((i: any) => i.userId === user._id)
                        ? 'Following'
                        : 'Follow'}
                    </Text>
                  </TouchableOpacity>
                )}  
              </TouchableOpacity>
                );


          }}
        />   

        )}
    {active === 2 && ( // если переключились на третий таб
        <Text style={tw`text-[18px] text-center pt-10 text-black`}>
           No Pending нет в ожидании</Text>
      )} 



    </SafeAreaView>
  );
};

export default FollowerCard;
