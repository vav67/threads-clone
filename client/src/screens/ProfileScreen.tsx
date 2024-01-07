import * as React  from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import  {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Dimensions} from 'react-native';
import {loadUser, logoutUser} from '../../redux/actions/userAction';
import PostCard from '../components/PostCard';
import tw from 'twrnc';


type Props = {
  navigation: any;
};
//ширина окна(411) реально 103
const {width} = Dimensions.get('window');

 

const ProfileScreen = ({navigation}: Props) => {
  const [active, setActive] = useState(0);
  
 const {user } = useSelector((state: any) => state.user);
 const {posts} = useSelector((state: any) => state.post); 

  const [data, setData] = useState([]); 
  // const [userData, setUserdata] = useState(user); // 12-17-19 добавлено
  const [repliesData, setRepliesData] = useState([]); // 12-47-10


  const dispatch = useDispatch();

  // ф-я выхода юзера при нажатии
  const logoutHandler = async () => { logoutUser()(dispatch);  };


  useEffect(() => {
//выбрали посты
    if (posts && user) {
      const myPosts = posts.filter((post: any) => post.user._id === user._id);
          setData(myPosts);
         }

  }, [posts,user]   )

   useEffect(() => {
// выбираем реплики юзера к постам

    if (posts && user) {
      const myReplies = posts.filter((post: any) =>
        post.replies.some((reply: any) => reply.user._id === user._id),
      );
      setRepliesData(myReplies.filter((post: any) => post.replies.length > 0));
    }
  }, [posts, user]);

 // console.log( '=-----ProfileScreen=== user=', user)

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
                <View style={tw`pl-3`}>
      <Text style={tw`text-black text-5 bg-[#707cec]`}>
      {user?.name}  это  ProfileScreen  </Text>
       </View>

      <SafeAreaView style={tw`text-[#1f1d1d]`}>
      <View>  
      <View
     //   style={{width: width, padding: 10,   }}
        //style={tw` flex-row   justify-between  bg-[#e61616]  w-${width}  `}
        style={tw` flex-row   justify-between  bg-[#b3e9f7]  w-${width/4} pr-2  `}
      >
          <View style={tw` ml-4`}>
              <Text style={tw`text-[#000] text-[30px]`}>
                   {user?.name}
               </Text>
              <Text style={tw`text-[#0000009d] text-[20px]`}>
                {user?.userName}
              </Text>
       </View>
              <Image
                source={{uri: user.avatar?.url}}
                height={80}
                width={80}
                borderRadius={100}
              />
      </View>
             

          <Text style={tw`p-3  text-[#000000d4] font-sans  text-4`}>
            {user?.bio} 
          </Text>

          <View  style={tw` p-1 `}>
          <TouchableOpacity   // 11-50-00
             onPress={() => //просматриваем подписчиков
               navigation.navigate('FollowerCard', {
                  followers: user?.followers,
                  following: user?.following,
               })          }
                >
              <Text style={tw`text-4 text-[#d12020]`}>
                {user?.followers.length}
                {  } followers подписчиков
              </Text>
            </TouchableOpacity>
            </View>

            <View  style={tw`pl-7 pt-1 flex-row w-full items-center`}>
          <TouchableOpacity
             onPress={() => navigation.navigate('EditProfile')}  >
              <Text  style={tw`    text-center  text-[#5c5b5b]
                px-3 py-1 border border-[#5c5b5b] bg-transparent `}
                   >          Edit Profile           </Text>
            </TouchableOpacity>
          
          <TouchableOpacity style={tw`ml-5`} onPress={logoutHandler} >
              <Text  style={tw`text-center  text-[#5c5b5b]
                px-3 py-1 border border-[#5c5b5b] bg-transparent`}
                  >     Log Out           </Text>
            </TouchableOpacity>
         </View>

    <View
          style={tw`border-b border-b-[#00000032] px-4 py-3 w-100%`}
           // style={{width: '100%'}}
           >
            <View style={tw`w-[80%] m-auto flex-row justify-between`} >
              <TouchableOpacity onPress={() => setActive(0)}>
                <Text
            
             style = {tw`  shadow-opacity-50
             ${ active === 0 ? 'opacity-100' :'opacity-63' } 
             ${ active === 0 ? 'font-bold' :'font-normal' } 
                      pl-3 text-4   text-[#000000c7]` } >  {' '} Threads
                      </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActive(1)}>
                <Text
         
                  //{fontWeight: active === 1 ? 'bold' : 'normal' }
                  style = {tw`  
                  ${ active === 1 ? 'opacity-100' :'opacity-63' } 
                  ${ active === 1 ? 'font-bold' :'font-normal' } 
                   pl-3 text-4  text-[#000000c7]  ` } 

                  >
                  Replies
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {active === 0 ? (
 <View style={tw`w-[50%] absolute h-[1px] bg-black left-[-10px] bottom-0`} />
          ) : (
 <View style={tw`w-[50%] absolute h-[1px] bg-black right-[-10px] bottom-0`} />
          )}
 </View>
      

 {active === 0 && (  
  // переключение между табами
          <>
            {data &&
              data.map((item: any) => (
      <PostCard 
            navigation={navigation} 
            key={item._id} 
            item={item}
            
            />
              ))}
          </>
        )}

        {active === 1 && (
          <>
        {repliesData &&
              repliesData.map((item: any) => (
                <PostCard
                  navigation={navigation}
                  key={item._id}
                  item={item}
                  replies={true}
                />
              ))}

     </>
        )}

{active === 0 && (
          <>
            {data.length === 0 && (
              <Text style={tw`text-black text-[14px] mt-8 text-center`}>
                You have no posts yet!
              </Text>
            )}
          </>
        )}






      </SafeAreaView>
    </ScrollView>

  )
}

export default ProfileScreen