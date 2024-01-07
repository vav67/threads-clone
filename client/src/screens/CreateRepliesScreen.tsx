import {
  View,
  Text,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
  import {useDispatch, useSelector} from 'react-redux';
  import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
 import getTimeDuration from '../common/TimeGenerator';
 import axios from 'axios';
  import {URI} from '../../redux/URI';
  import { getAllPosts } from '../../redux/actions/postAction';

import tw from 'twrnc';


type Props = {
 //ненужно показывать item: any;
  navigation: any;
  route: any;
 //ненужно показывать  postId: string;
};
//const CreateRepliesScreen  = ({item,  navigation, postId  }: Props)
// или заменим как route
const CreateRepliesScreen = ({navigation, route }: Props) => {

   const post = route.params.item;
    const postId = route.params.postId; //<-- добавили вот индетификатор 10-07-47
  
    const {user, token} = useSelector((state: any) => state.user);
 const [image, setImage] = useState('');
  const [title, setTitle] = useState('');
   //const dispatch = useDispatch();
  ///// console.log(  'ЭТО postId==' ,  postId ) 
 

  const ImageUpload = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.8,
      includeBase64: true,
    }).then((image: ImageOrVideo | any ) => {
      if (image ) {
        setImage('data:image/jpeg;base64,' + image.data);
      }
    });
  };
//формат даты
  const time = post.createdAt;
  const formattedDuration = getTimeDuration(time);

//   const qcreateReplies = async () => {
//     if (!postId) { 
//       console.log( user._id,'-юзер  НЕТ реплики  postId= ' ,
//         postId + '  title='+ title + '  image='+ image ) 
  
//     }
//     else {

// console.log( user._id,'-юзер есть реплика replyId=',  post._id + '  postId='+ 
// postId + '  title='+ title + '  image='+ image ) 
  

//     }
//   }


   const createReplies = async () => {
  if (!postId) { 
    // если нету
    console.log( user._id,'-юзер  НЕТ реплики  postId= ' ,
    postId + '  title='+ title + '  image='+ image ) 


      await axios.put( `${URI}/add-replies`,
          { postId: post._id, title, image, user }, //сам добавил user( так как данные всегда от bbb)
          {  headers: { Authorization: `Bearer ${token}`, }, },
        )
      .then((res: any) => {
    //  navigation.goBack()
    //  getAllPosts()(dispatch) 
        navigation.navigate('PostDetails', {
            data: res.data.post,   // item: post,
            navigation: navigation,
           });
           setTitle('');  //очищаем
           setImage('');   //очищаем 
      });
     } else { 
       // тогда существует
 // console.log( user._id,'-юзер есть реплика replyId=',  post._id + '  postId='+ 
//postId + '  title='+ title + '  image='+ image ) 

  await axios.put(`${URI}/add-reply`,
     { postId,
        replyId: post._id, 
         title, 
         image, 
         user, //сам добавил user( так как данные всегда от bbb)
     },
     { headers: {  Authorization: `Bearer ${token}`,  },  },
     ).then((res: any) => {
          navigation.navigate('PostDetails', {
            data: res.data.post,
            navigation: navigation,
          });
          setTitle('');  //очищаем
          setImage('');   //очищаем 
        });
    }
  };



  return (
    <SafeAreaView>
    
    <View style={tw`pl-3`}>
        <Text style={tw`text-black text-6 bg-[#707cec]`}>
        {user.name }   это createRepliesScreen </Text>
    </View>


    <View style={tw`flex-row items-center p-3 bg-[#dceeb2]`}>


        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png',
            }}
            width={25}
            height={25}
          />
        </TouchableOpacity>
        <Text style={tw`text-6 left-4 font-600 text-[#000]`}>Reply</Text>
    </View>


<View style={tw` h-[87%]  justify-between flex-col bg-[#9ff8d3] `}> 
   <ScrollView style={tw`relative`}  showsVerticalScrollIndicator={false} >
    

          <View style={tw`flex-row w-full justify-between p-3`}>
            <View style={tw`flex-row items-center`}>
              <Image
                source={{uri: post.user.avatar.url}}
                width={40}
                height={40}
                borderRadius={100}
              />

              <View style={tw`pl-3`}>
                <Text style={tw`text-black font-[500] text-[18px]`}>
                  {post.user.name}
                </Text>
                <Text style={tw`text-black font-[500] text-[16px]`}>
                  {post.title}
                </Text>
              </View>
            </View>

            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-[#000000b6]`}>{formattedDuration}</Text>
              <TouchableOpacity>
                <Text style={tw`text-[#000] pl-4 font-[700] mb-[8px]`}>
                  ...
                </Text>
              </TouchableOpacity>
            </View>
          </View>

 
          <View style={tw`ml-[50px] my-3`}>
            {post.image && (
              <Image
                source={{uri: post.image.url}}
                style={{
                  width: '90%',
                  aspectRatio: 1,
                  borderRadius: 10,
                  zIndex: 1111,
                }}
                resizeMode="contain"
              />
            )}
          </View>
          {post.image ? (
<View style={tw`absolute top-[125] left-8 h-[75%] w-[3px] bg-[#00000017]`} />
          ) : (
<View style={tw`absolute top-12 left-5 h-[60%]  w-[8px] bg-[#00000017]`} />
          )      }

  {/* ответ */}
          <View style={tw`p-3  `}>
            <View style={tw`flex-row items-center`}>
              <Image
                source={{uri: user.avatar.url}}
                width={40}
                height={40}
                borderRadius={100}
              />
              <View style={tw`pl-3`}>
                <Text style={tw`text-black font-500 text-[18px]`}>
                  {user.name}
                </Text>
                <TextInput
                  placeholder={`Reply to ${post.user.name}...`}
                  placeholderTextColor={'#666'}
                  style={tw`mt-[-5px] ml-1 text-black`}
                  value={title}
                  onChangeText={setTitle}
                />
                <TouchableOpacity style={tw`mt-2`}  onPress={ImageUpload}  >
                  <Image
   source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png',  }}
                    style={{  width: 20, height: 20,  }}
                  />
                </TouchableOpacity>
              </View>
            </View> 
      
      <View> 
         {image && (  <Image   source={{uri: image}}
               style={{
                    width: '85%',
                    aspectRatio: 1,
                    borderRadius: 10,
                    zIndex: 1111,
                    marginLeft: 45,
                    marginVertical: 20,
                  }}
                />
              )}  
      </View>   
        </View> 
   
   </ScrollView> 


     <View>
       <View style={tw`p-1`}>
            <View style={tw`w-full flex-row justify-between bottom-2`}>
              <Text style={tw`left-2 text-[#000]`}>Anyone can reply</Text>
              <TouchableOpacity onPress={createReplies}>
                <Text style={tw`text-[#1977f2] right-4`}>Post</Text>
              </TouchableOpacity>
            </View>
          </View> 


    </View>








  </View> 
    </SafeAreaView>
  );
};

export default CreateRepliesScreen;
