import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import PostDetailsCard from '../components/PostDetailsCard';
import {useSelector} from 'react-redux';

import tw from 'twrnc';
import PostCard from '../components/PostCard';

type Props = {
  navigation: any;
  route: any;
   //isReply?: boolean | null; 
 
};

const PostDetailsScreen = ({navigation, route}: Props) => {
  const {user} = useSelector((state: any) => state.user); //сам добавил

  let item = route.params.data;
  //console.log( 'item', item)
  const {posts} = useSelector((state: any) => state.post);
  const [data, setdata] = useState(item);

  useEffect(() => {
  if (posts) {
     const d = posts.find((i: any) => i._id === item._id);
      setdata(d);
   }
  }, [posts]);

  return (
    <SafeAreaView>
      
        <View style={tw`pl-3`}>
      <Text style={tw`text-black text-6 bg-[#707cec]`}>
           {user?.name}  -- это PostDetailsScreen   </Text>
       </View>

      <View style={tw`relative flex-col justify-between bg-[#ebf8cc]`}>
        <View style={tw`h-[96%]   bg-[#f0bbc1] `}>
            <View style={tw`px-3`}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/2223/2223615.png',
                }}
                height={25}
                width={25}
              />
            </TouchableOpacity>
          </View>  

    <ScrollView showsVerticalScrollIndicator={false}>
 
            <PostDetailsCard // 10-29-09 заменили PostCard   
              navigation={navigation}
              item= {data}
             // postId={data._id}
            />  
          <View style={tw` bg-[#dcf5a3]`}  
   //дальше ответы
           >
          
              {data?.replies?.map((i: any, index: number) => {        
                return (
                  <  PostDetailsCard  // 10-29-09 заменили PostCard           
                    navigation={navigation}
                    item={i}
                    key={index}
                   isReply={true}
                    postId={item._id}  // <-- добавили 10-06-42 
                  />
                );
              })} 

              <View style={tw`mb-12     `}
              //нижняя часть для последнего сообщения
              ></View>
            </View>  
      </ScrollView>


        </View>
       
       <View style={tw`absolute bottom-1 flex-row w-full justify-center bg-white h-[70px] items-center`}>
          <TouchableOpacity
            style={tw`w-[96%] bg-[#00000026] h-[45px] rounded-[40px] flex-row items-center`}
            onPress={() =>
              navigation.replace('CreateReplies', {
                item: item,
                navigation: navigation,
              })
            }
            >
            <Image
              source={{uri: item.user.avatar.url}}
              width={30}
              height={30}
              borderRadius={100}
              style={tw`ml-3 mr-3`}
            />
            <Text style={tw`text-[16px] text-[#0000009b]`}>
              Reply to ответ пользователю= {item.user.name}{' '}
            </Text>
          </TouchableOpacity> 

           
        </View> 




      </View>
    </SafeAreaView>
  );
};

export default PostDetailsScreen;
