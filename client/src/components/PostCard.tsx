import {
  View,
  Text,
  TouchableOpacity,
  Modal, // 13-11-42 добавления модального окна
  TouchableWithoutFeedback,
} from 'react-native';
import React, {useEffect, useState} from 'react';
 import {useDispatch, useSelector} from 'react-redux';
  import {Image} from 'react-native';
 import getTimeDuration from '../common/TimeGenerator'; //формати даты
import {
  addLikes,
  getAllPosts,
  removeLikes,
} from '../../redux/actions/postAction';
  import axios from 'axios';
  import {URI} from '../../redux/URI';
 import PostDetailsCard from './PostDetailsCard';
import tw from 'twrnc';
 

type Props = {
   navigation: any;
    item: any;
  isReply?: boolean | null;
  postId?: string | null; // ---добавил 10-07-10
   replies?: boolean | null; // 12-30-59
};
 
const PostCard = ({item, isReply, navigation,   postId, replies
     }: Props) => {

     // console.log( '----------------- PostCard item=', item )

   const {user, token,users} = useSelector((state: any) => state.user);
    const {posts} = useSelector((state: any) => state.post);
 
  
   const [active, setActive] = useState(false);

   const [openModal, setOpenModal] = useState(false);// 13-10-36

   const [userInfo, setUserInfo] = useState({
    name: '',
    avatar: {
      url: 'https://res.cloudinary.com/dshp9jnuy/image/upload/v1665822253/avatars/nrxsg8sd9iy10bbsoenn.png',
    },
  });

  const dispatch = useDispatch();

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

      const isLikedBefore = item.likes.find(
                 (i: any) => i.userId === user._id);
                 
      if (isLikedBefore) {
//удаляем лайк
       removeLikes({
        postId: e._id, posts, user
       // postId: postId ? postId : e._id, posts, user
         })(dispatch);
      } else {
//добавляем лайк        
        addLikes({
          postId: e._id, posts, user
          //     postId: postId ? postId : e._id, posts, user
           })(dispatch);
      }
    } else {
      addLikes({
        postId: e._id, posts, user
      //  postId: postId ? postId : e._id, posts, user
      })(dispatch);
    }
  };

  const deletePostHandler = async (e: any) => {
    await axios
      .delete(`${URI}/delete-post/${e}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(res => {
        getAllPosts()(dispatch);
      });
  };

useEffect( () => {
  axios.get(`${URI}/get-user/${item.user._id}`, {
    headers: {Authorization: `Bearer ${token}`},
  })
  .then(res => { setUserInfo(res.data.user) })

}, [])


  // useEffect(() => {
  //  if(users){
  //   const updatedUsers = [...users, user];
  //   const userData = updatedUsers.find((user: any) =>
  //       user._id === item.user._id
  //    );
  //    setUserInfo(userData);
  //  }
  // }, [users]);

  ////console.log(  'POSTCARD 10-08-27 postId==' ,  postId ) 

  return (
    <View style={tw`  p-4 border-b border-b-[#00000017] bg-[#a6f581]`}>
     <View style={tw`pl-3`}>
      <Text style={tw`text-black text-5 bg-[#707cec]`}>
               это компонент PostCard  </Text>
       </View>

    <View style={tw`relative  bg-[#b0e6de]  `}>
         <View style={tw`flex-row w-full`}>
          <View style={tw`flex-row w-[85%] items-center`}>
            <TouchableOpacity          
        onPress={() => profileHandler(item.user)} >
              <Image
                 source={{uri: userInfo?.avatar?.url }}    //item.user.avatar?.url}}  
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
    onPress={() => item.user._id === user._id && setOpenModal(true)}
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
   <TouchableOpacity onPress={() => reactsHandler(item)}
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

 


        {!isReply && (    
   <View  //   отображаем кол-во  replies и   likes    
        style={tw`pl-[50px] pt-4 flex-row`}>
            
            <TouchableOpacity
     onPress={() => navigation.navigate('PostDetails', { data: item,  })     }
              >
              <Text  style={tw`text-4 text-[#0000009b]`}>
     { item?.replies?.length !== 0 &&
                  `${item?.replies?.length} replies ·`}  {' '}
              </Text>
            </TouchableOpacity>



             <TouchableOpacity
              onPress={() =>
            item.likes.length !== 0 &&  //переход при наличии лайков
    navigation.navigate('PostLikeCard', { 
           item: item.likes, 
           navigation: navigation, 
               }) 
                  } >
            <Text  style={tw`text-4 text-[#0000009b]`}>
         {item.likes.length} {item.likes.length > 1 ? 'likes' : 'like'}
              </Text>
            </TouchableOpacity> 
          </View>
  )}
   
  
       </View>

       {replies && (
          <>
            {item?.replies?.map((i: any) => (
              <PostDetailsCard
                navigation={navigation}
                key={i._id}
                item={i}
                isReply={true}
                postId={item._id}
              />
            ))}
          </>
        )}


   {/*  открытие модального окна             */}  
       {openModal && (
          <View style={tw`flex-1 justify-center items-center mt-22`}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={openModal}
              onRequestClose={() => {
                setOpenModal(!openModal);
              }}>
              <TouchableWithoutFeedback onPress={() => setOpenModal(false)}>
                <View style={tw`flex-1 justify-end bg-[#cdcdd899]`}>
                  <TouchableWithoutFeedback onPress={() => setOpenModal(true)}>
               <View style={tw`w-[100%] bg-[#f8f4f4] h-[120px] rounded-5 p-5
                       items-center shadow-[#000]  `}>
                      <TouchableOpacity
                 style={tw`w-full bg-[#00000010] h-[50px] rounded-2 items-center flex-row pl-5`}
    onPress={() => deletePostHandler(item._id)}>
                        <Text style={tw`text-[18px] font-600 text-[#e24848]`}>
                          Delete
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        )} 
    {/* ------------------------------------    */}

    
    
    </View>
  );
};

export default PostCard;
