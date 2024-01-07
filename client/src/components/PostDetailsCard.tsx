import * as React  from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
  import  {useEffect, useState} from 'react';
  import {useDispatch, useSelector} from 'react-redux';
  import {Image} from 'react-native';
   import getTimeDuration from '../common/TimeGenerator'; //формати даты
 import {
   addLikes,
   getAllPosts,
   removeLikes,
   addLikesToRepliesReply,
   addLikesToReply,
     removeLikesFromRepliesReply,
    removeLikesFromReply,
 } from '../../redux/actions/postAction';
   import axios from 'axios';
   import {URI} from '../../redux/URI';
  
  import AsyncStorage from '@react-native-async-storage/async-storage'; 
 import tw from 'twrnc';

 
 
 type Props = {
  navigation: any;
   item: any;
 isReply?: boolean | null;
 postId?: string | null; // ---добавил 10-07-10
 // replies?: boolean | null;
 isRepliesReply?: boolean; //11-01-17
};



const PostDetailsCard = ({item, isReply, navigation, postId, isRepliesReply,  // replies
     }: Props) => {

   const {user, token, users} = useSelector((state: any) => state.user);
    const {posts} = useSelector((state: any) => state.post);
 
    const dispatch = useDispatch();
   const [active, setActive] = useState(false);

  // const [openModal, setOpenModal] = useState(false);
   const [userInfo, setUserInfo] = useState({
    name: '',
    avatar: {
      url: 'https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png',
    },
  });
    const time = item?.createdAt;
  const formattedDuration = getTimeDuration(time);


// переход к профилю юзера
  const profileHandler = async (e: any) => {
    await axios.get(`${URI}/get-user/${e._id}`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        
        if (res.data.user._id !== user._id) {
          // console.log( 'user=', res.data.user)
          navigation.navigate('UserProfile', {
            item: res.data.user,
          });
        } else {
          navigation.navigate('Profile');
        }
      });
  };

 
//Лайк щелкаем по сердечку
  const reactsHandler = (e: any) => {

        if (item.likes.length !== 0) {
 const isLikedBefore = item.likes.find((i: any) => i.userId === user._id);
                 
        if (isLikedBefore) {  //удаляем лайк
//console.log(  '====!!==reactsHandler удаляем лайк  ')  
 removeLikes({postId: postId ? postId : e._id, posts, user })(dispatch);
  // postId: e._id, posts, user
        } else {  //добавляем лайк   
//console.log(  '====!!==reactsHandler добавляем лайк  ')
  addLikes({ postId: postId ? postId : e._id, posts, user })(dispatch);
         //  postId: e._id, posts, user
      }
        } else {  //console.log(  '!!==reactsHandler ЛАЙКОВ НОЛЬ  ')  
       addLikes({postId: postId ? postId : e._id, posts, user})(dispatch);
      //  postId: e._id, posts, user
           }
  };


  const replyReactHanlder = (e: any) => {

 //console.log(  '================replyReactHanlder='  )

   if (e.likes.length !== 0) {
   const isLikedBefore = e.likes.find((i: any) => i.userId === user._id);
      if (isLikedBefore) {
             removeLikesFromReply({
         // removeLikes({  
          postId: postId ? postId : e._id,
          posts,
            replyId: e._id,
          user,
             title: e.title,
        })(dispatch);
      } else {  
        addLikesToReply({  
        //addLikes({
          postId: postId ? postId : e._id,
          posts,
             replyId: e._id,
          user,
              title: e.title,
        })(dispatch);
      }
  } else {
      addLikesToReply ({
     // addLikes ({ 
         postId: postId ? postId : e._id,
         posts,
            replyId: e._id,
         user,
            title: e.title, 
      })(dispatch);
    }
   };

//11-02-39 запоминает окрыты коменты или нет
   const handlePress = async (e: any) => {
    setActive(!active);
    await AsyncStorage.setItem('replyId', e._id);
  };


 //лайки на ответы ответов
 //добавляет и удаляет лайки в ответх ответов
  const repliesReplyReactHandler = async (e: any) => {
    const replyId = await AsyncStorage.getItem('replyId');
    if (e.likes.length !== 0) {
      const isLikedBefore = e.likes.find((i: any) => i.userId === user._id);
      if (isLikedBefore) {
        //remove like удаляем
        removeLikesFromRepliesReply({
          postId: postId,
          posts,
          replyId,
          singleReplyId: e._id,
          user,
          title: e.title,
        })(dispatch);
      } else {
        // add likes добавляем
        addLikesToRepliesReply({
          postId: postId,
          posts,
          replyId,
          singleReplyId: e._id,
          user,
          title: e.title,
        })(dispatch);
      }
    } else {
      //add like  или ноль - поэтому добавляем лайк на ответ ответа
      addLikesToRepliesReply({
        postId: postId,
        posts,
        replyId,
        singleReplyId: e._id,
        user,
        title: e.title,
      })(dispatch);
    }
  };
 
 

// 13-54-48 добавил как и в PostCard.tsx 
  useEffect( () => {
    axios.get(`${URI}/get-user/${item.user._id}`, {
      headers: {Authorization: `Bearer ${token}`},
    })
    .then(res => { setUserInfo(res.data.user) })
  
  }, [])



 
  return (
    <View
     //style={tw`  p-4 border-b border-b-[#00000017] bg-[#a6f581]`}>
    // ${ !isReply && 'border-b-[#00000017] border-b' } 
    //${  isReply ? 'border-b-[#131111] border-b-4' :  '' } 
    style = {tw   ` p-[15px]
    ${ isReply ? 'border-b-[#131111] border-b ': '' } 
    ${ isReply ?  'left-8 w-[92%] bg-[#f4f772]  ' : 'left-[0] w-[100%] bg-[#68ee47]   '  }
      
          `}   >

     <View style={tw`pl-3`}>
      <Text style={tw`text-black text-5 bg-[#707cec]`}>
               это компонент PostDetailsCard  </Text>
       </View>

    <View style={tw`relative  bg-[#eb44fa]  `}>
         <View style={tw`flex-row w-full`}>
          <View style={tw`flex-row w-[85%] items-center`}>
            <TouchableOpacity          
        onPress={() => profileHandler(item.user)} >
              <Image
                source={{uri: userInfo?.avatar?.url }}    //item.user.avatar?.url}}     //}}
                width={40}
                height={40}
                borderRadius={100}
              />
            </TouchableOpacity>

           <View style={tw`pl-3 w-[70%]`}>
              <TouchableOpacity
    style={tw`flex-row items-center`}
              onPress={() => profileHandler(item.user)}  >
                <Text style={tw`text-black font-300 text-4`}>
                       { userInfo.name }    {/*  {item.name}==={item.user.name} */}
                </Text>
                {/* {userInfo?.role === 'Admin' && ( */}
                {/*   <Image
                    source={{
                      uri: 'https://cdn-icons-png.flaticon.com/128/1828/1828640.png',
                    }}
                    width={15}
                    height={15}
                    style={tw`ml-1`}
                  /> */}
                {/* )} */}
              </TouchableOpacity>
                     <Text style={tw`text-black font-500 text-4`}>
                        {item.title}
                        </Text>
                  
            </View>
          </View>

 
            <View style={tw`flex-row items-center`}>
            <Text style={tw`text-[#000000b6]`}>{formattedDuration}</Text>
            <TouchableOpacity
            //  onPress={() => item.user._id === user._id && setOpenModal(true)}
              >
              <Text style={tw`text-[#000] pl-4 font-700 mb-[8px]`}>...</Text>
            </TouchableOpacity>
          </View>
  </View>

         <View style={tw`ml-[50px] my-3`}>
          {item.image && (
            <Image  //фото в сообщении
              source={{uri: item.image.url}}
              style={{aspectRatio: 1, borderRadius: 10, zIndex: 1111}}
              resizeMode="contain"
            />
          )}
        </View>

     {item.image ? (
      <View //разделяющие линии сообщений
      style={tw`absolute top-12 left-5 h-[92%] w-2 bg-[#00000017]`} />
        ) : (
 <View style={tw`absolute top-12 left-5 h-[53%] w-2 bg-[#00000017]`} />
        )}


          <View  style={tw`flex-row items-center left-[50px] top-[5px]`}>
   <TouchableOpacity 
  // onPress={() => !isReply ? reactsHandler(item) : replyReactHanlder(item)}
   // 11-03-49 заменяем на 
   onPress={() =>
    !isRepliesReply
      ?     !isReply ? reactsHandler(item)  : replyReactHanlder(item)
      : repliesReplyReactHandler(item)
  }  
// картинка сердечко    
          >
         {item.likes.length > 0 ? (
              <> 
      {item.likes.find((i: any) => i.userId === user._id) ? (
     <Image  source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589175.png', }}
     width={30}  height={30}   />
  
            ) : (
    <Image source={{  uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589197.png', }}
                width={30}  height={30}  />   )}
              </>
         ) : (
    <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2589/2589197.png', }}
                width={30}  height={30}  />   )}
          </TouchableOpacity>


          <TouchableOpacity
           onPress={() => {
              navigation.navigate('CreateReplies', {
                item: item,
              navigation: navigation,
                postId: postId, //<--- добавил 10-07-20
              });
            }}
            >
            <Image
  source={{uri: 'https://cdn-icons-png.flaticon.com/512/5948/5948565.png',}}
      width={22} height={22}  style={tw`ml-5`} />
          </TouchableOpacity>
          <TouchableOpacity>
         <Image
 source={{uri: 'https://cdn-icons-png.flaticon.com/512/3905/3905866.png',}}
   width={25} height={25}  style={tw`ml-5`} />
          </TouchableOpacity>
          <TouchableOpacity>
        <Image
 source={{uri: 'https://cdn-icons-png.flaticon.com/512/10863/10863770.png',}}
    width={25} height={25}  style={tw`ml-5`} />
          </TouchableOpacity>
 
    </View>

 


        {/* {!isReply && (     */}
   <View  //   отображаем кол-во  replies и   likes    
        style={tw`pl-[50px] pt-4 flex-row`}>
            
            <TouchableOpacity
     onPress={() => navigation.navigate('PostDetails', { data: item,  })     }
              >
                 </TouchableOpacity>
              <Text  style={tw`text-4 text-[#0000009b]`}>
     {/* { item?.replies?.length !== 0 &&
                  `${item?.replies?.length} replies+++ ·`}  {' '}  */}
    {item.likes.length} {item.likes.length > 1 ? 'likes++' : 'like++'}
              </Text>
 
          </View>
    
   
{ //11-17-29 добавим 

!isRepliesReply && (    
  <View  //   отображаем кол-во  replies и   likes    
       style={tw`pl-[50px] pt-4 flex-row`}>
<Text  style={tw`text-4 text-[#0000009b]`}> 
{item.likes.length} {item.likes.length > 1 ? 'likes@@' : 'like@@'}
     </Text>
</View>
    )
}
   </View>
  
  {  item.reply  && (
    <>
   { item.reply.length !== 0 && (
            <>
     <View style={tw`  items-center flex-row  `}>
  <TouchableOpacity
          onPress={() => handlePress(item) } //deletePostHandler(item._id)}
  //</View>onPress={() => setActive(!active)}     
     >
 
  <Text style={tw`ml-15 mt-2 text-4 text-[#080808]`}>
   { active ?  'Hide Replies' :  'View Replies'}
  </Text>
  </TouchableOpacity>
  <TouchableOpacity>
  <Text style={tw`ml-4 mt-2 text-4 text-[#080808]`}> 
  {item.likes.length} {' '}
   {item.likes.length > 1 ? 'likes***' : 'like***'}
  </Text>
</TouchableOpacity>
     </View>
           {  active && (  // отображ или скроем
              <>
          {item.reply.map((i: any) => (
                    <PostDetailsCard
                      navigation={navigation}
                      item={i}
                      key={i._id} 
                      isReply={true}
                      postId={postId}
                  isRepliesReply={true} //11-01-10
                    />
                  ))}
{/* 10-28-50 конец прохода item.reply.map  ответов на ответ */}
            </>
             ) 
           }
    </>
      )}
     </>

)}  
     </View>
  );
};

export default PostDetailsCard;
