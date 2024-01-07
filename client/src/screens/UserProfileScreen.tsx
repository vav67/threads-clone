import * as React  from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import  {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
 
import tw from 'twrnc';
import { followUserAction, unfollowUserAction } from '../../redux/actions/userAction';
import PostCard from '../components/PostCard';
 
 



type Props = {
  navigation: any;
  route: any
};

const UserProfileScreen = ({navigation, route}: Props) => {
const d= route.params.item
 // console.log( 'item=', d.name)

 //console.log( 'route.params =', route.params) 
  const {users, user, isLoading, tokenfirebase } = useSelector((state: any) => state.user);
 // console.log( '!! users=', users +  ' user=' + user )
  //const [fir, setFir] = useState('aa')
 
  const [imagePreview, setImagePreview] = useState(false);
  const [active, setActive] = useState(0);
  //посты
  const {posts} = useSelector((state: any) => state.post);
  const [postData, setPostsData] = useState([]);
  const [repliesData, setRepliesData] = useState([]);//12-39-47

  const [data, setData] = useState(d);
  const dispatch = useDispatch();

//   useEffect(() => {
//     console.log( '+++++++++++++++++++++++++++' )
//   //   if ( tokenfirebase) { 
//   // console.log( '+++++++++tokenfirebase =', tokenfirebase) 
//   // setFir(tokenfirebase)  
//   //   } else { console.log( '+++++++НЕТУ')   }
// }, []   )   


useEffect(() => {

  if ( users) {   //posts && user) {

   // console.log( 'совпадает айди юзера и айди подписки users=', users)
    // если совпадает айди юзера и айди подписки
const userData = users.find((i:any) => i._id === d?._id)
   setData(userData)
      }

if (posts ) {
  //в постах выбираем ответы юзера
  //Find posts where the user (d._id) has replied
  const myPosts = posts.filter( (y: any) => y.replies.some(
     (reply: any) => reply.user._id === d._id),  )


  setRepliesData( myPosts.filter( (post:any) => post.replies.length > 0 ))
   
//Find posts made by the user (d._id)
const myUserPosts =posts.filter((post: any) => post.user._id === d._id);
setPostsData(myUserPosts)
}
  
}, [users, route.params.item, posts, d]   )    


//нажимаем на кнопку подписки ---------также как в SearchScreen     
const FollowUnfollowHandler = async () => {
  try {
  //проверка совпадения айди
    if (data.followers.find((i: any) => i.userId === user._id)) {
      await unfollowUserAction({ //отписка
        userId: user._id,
        users,
        followUserId: data._id,
        tokenfirebase,  //сам передаем токен для оповещения
      })(dispatch);
    } else {
      await followUserAction({ // подписка
        userId: user._id,
        users,
        followUserId: data._id,
        tokenfirebase,  //сам передаем токен для оповещения
      })(dispatch);
    }
  } catch (error) {
    console.log(error, 'error');
  }
};

// console.log( 'tokenfirebase fir=', fir)
 
  return (
    <>
               <View style={tw`pl-3 h-[58px] `}>
      <Text style={tw`text-black text-5  bg-[#707cec]`}>
          {user?.name} ===это UserProfileScreen  </Text>
       </View>
 

      {data && (
        <SafeAreaView>
          {imagePreview ? (
            <TouchableOpacity
            style = {tw`ph-screen bg-white w-full items-center justify-center`}
              onPress={() => setImagePreview(!imagePreview)}>
              <Image
                source={{uri: data.avatar.url}}
                width={250}
                height={250}
                borderRadius={500}
              />
            </TouchableOpacity>
          ) : 
          (
         <View   style = {tw`p-2`}>
  <TouchableOpacity  onPress={() => navigation.goBack()}>
  <Image source={{
    uri: 'https://cdn-icons-png.flaticon.com/512/2223/2223615.png'}}
       height={20}      width={20}    />      
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style = {tw`w-full flex-row justify-between`}>
                  <View style = {tw`w-[80%]`}>
        <Text style = {tw`pt-3 text-7 text-black`}> {data.name}   </Text>
              
             {data.userName && (
                      <Text style = {tw`py-2 text-7 text-[#0000009d]`}>
                        {data.userName}   
                      </Text>
                    )}
            {data.bio && (
                    <Text style = {tw`py-2 text- 4 text-[#000000c4]`}>
                        {data.bio} 
                      </Text>
                    )}
                    <TouchableOpacity
                      onPress={() => //просматриваем подписчиков
                        navigation.navigate('FollowerCard', {
                        
                          followers: data?.followers,
                          following: data?.following,
                        })
                      }
                      >
                      <Text style = {tw`py-2 text-5 text-[#0cfd20c5]`}>
                        {data.followers.length} --foll=====owers подписчиков
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => setImagePreview(!imagePreview)}>
                 <View style = {tw`relative`   } >
    
                      <Image
                        source={{uri: data.avatar.url}}
                        width={60}
                        height={60}
                        borderRadius={100}
                      />
                      {/* {data.role === 'Admin' && (
                        <Image
                          source={{
                            uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828640.png',
                          }}
                          width={18}
                          height={18}
                          style = {tw`l-2 absolute bottom-0 left-0`}
                        />
                      )} */}
                    </View>
                  </TouchableOpacity>
                </View>

        <TouchableOpacity
  style = {tw`mt-2 rounded-[8px] w-full flex-row justify-center items-center h-8 bg-black`}
                  onPress={FollowUnfollowHandler}>
                  <Text style = {tw`text-white text-5`}>
                    {data.followers.find((i: any) => i.userId === user._id)
                      ? 'Following'
                      : 'Follow'}
                  </Text>
                </TouchableOpacity>

    <View style = {tw`w-full border-b border-b-[#00000032] pt-5 pb-2 relative`}>
              <View style = {tw`w-[80%] m-auto flex-row justify-between`}>
                    <TouchableOpacity onPress={() => setActive(0)}>
                      <Text
    style={[{color: 'black', fontSize: 18,paddingLeft: 3 },
        {opacity: active === 0 ? 1 : 0.4}, {fontWeight: active === 0 ? 'bold' : 'normal' }]}
                      >        {' '}    Threads
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setActive(1)}>
                      <Text
    style={[{color: 'black',  fontSize: 18,  //fontWeight: 'bold',  height: 20
         paddingLeft: 3 },{opacity: active === 1 ? 1 : 0.4}, {fontWeight: active === 1 ? 'bold' : 'normal' } ]}        
                      >     {' '}   Replies
                      </Text>
                    </TouchableOpacity>
                  </View>
              
            
                  {active === 0 ? (
  <View style = {tw`w-[50%] absolute h-[1px] bg-black left-[-10px] bottom-0`} />
                  ) : (
  <View style = {tw`w-[50%] absolute h-[1px] bg-black right-[-10px] bottom-0`} />
                  )}
                </View>


     {active === 0 && (
         // переключение между табами
      <>   
                {postData &&
                      postData.map((item: any) => (
                        <PostCard
                          navigation={navigation}
                          key={item._id}
                          item={item}
                        />
                      ))}
      {postData.length === 0 && (
    <Text style = {tw`text-black py-10 text-center text-5`}>
                        No Post yet!
                      </Text>
                    )} 
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
     {active !== 1 && postData.length === 0 && (
       <Text style = {tw`text-black py-10 text-center text-[18px]`}>
            No Post yet!
                      </Text>
                    )}  
                  </>
                )}

 
 
   

              </ScrollView>
             </View>
              )
              }
            </SafeAreaView>
        )}
 
    </>
  )
}

export default UserProfileScreen