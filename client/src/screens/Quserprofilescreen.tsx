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
//import PostCard from '../components/PostCard';
import QPostCard from '../components/QPostCard';
 
 



type Props = {
  navigation: any;
  route: any
};

const Quserprofilescreen = ({navigation, route}: Props) => {
const d= route.params.item
 // console.log( 'item=', d.name)

 //console.log( 'route.params =', route.params) 
  const {users, user, isLoading, myfirebasetoken } = useSelector((state: any) => state.user);   
  
 
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

 
 
  return (
    <>
               <View style={tw`pl-3 h-[58px] `}>
      <Text style={tw`text-black text-5  bg-[#707cec]`}>
          {user?.name} ===это ЙUserProfileScreen  </Text>
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
         {/*      
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
                    </TouchableOpacity> */}
                  </View>
                  {/* <TouchableOpacity
                    onPress={() => setImagePreview(!imagePreview)}>
                 <View style = {tw`relative`   } >
    
                      <Image
                        source={{uri: data.avatar.url}}
                        width={60}
                        height={60}
                        borderRadius={100}
                      />
         
                    </View>
                  </TouchableOpacity> */}
                </View>


                <View> 
                <>
  {postData &&
                      postData.map((item: any) => (
                        <QPostCard
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


                </View>

 

              </ScrollView>
             </View>
              )
              }
            </SafeAreaView>
        )}
 
    </>
  )
}

export default Quserprofilescreen