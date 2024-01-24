import * as React  from 'react';
import   {useEffect, useRef, useState} from 'react';

import {FlatList,  View , TouchableOpacity,
  Animated, 
  Easing,
   RefreshControl } from 'react-native';

import {SafeAreaView, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
 import {getAllPosts} from '../../redux/actions/postAction';
   import PostCard from '../components/PostCard';
import { StatusBar } from 'native-base';

   import Loader from '../common/Loader';
  import Lottie from 'lottie-react-native';  //13-24-05
 

 import { getAllUsers } from '../../redux/actions/userAction';

 import { Platform } from 'react-native';

import axios from 'axios';
import {URI} from '../../redux/URI';


import tw from 'twrnc';
 
const loader = require('../assets/animation_lkbqh8co.json');

type Props = {
    navigation: any;
};

const HomeScreen = (props: Props) => {
 const animation = true //сам добавил

  const {user, token, users} = useSelector((state: any) => state.user); //сам добавил

  const {posts, isLoading} = useSelector((state: any) => state.post);

  const dispatch = useDispatch();

 
 //if (animation) {  }
 //else {
 
  //для загрузчика  13-24-46
   const [offsetY, setOffsetY] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
    const [extraPaddingTop] = useState(new Animated.Value(0));
   const refreshingHeight = 100;
   const lottieViewRef = useRef<Lottie>(null);

//------------------
let progress = 0;
if (offsetY < 0 && !isRefreshing) {
  const maxOffsetY = -refreshingHeight;
  progress = Math.min(offsetY / maxOffsetY, 1);
}

function onScroll(event: any) {
  const {nativeEvent} = event;
  const {contentOffset} = nativeEvent;
  const {y} = contentOffset;
  setOffsetY(y);
}

function onRelease() {
  if (offsetY <= -refreshingHeight && !isRefreshing) {
    setIsRefreshing(true);
    setTimeout(() => {
      console.log( '-### HomeScreen getAllPosts onRelease посты ' )  
      getAllPosts()(dispatch);
      setIsRefreshing(false);
    }, 3000);
  }
}

function onScrollEndDrag(event: any) {
  const { nativeEvent } = event;
  const { contentOffset } = nativeEvent;
  const { y } = contentOffset;
  setOffsetY(y);

  if (y <= -refreshingHeight && !isRefreshing) {
    setIsRefreshing(true);
    setTimeout(() => {
      console.log( '-### HomeScreen getAllPosts onScrollEndDrag посты ' )  
      getAllPosts()(dispatch);
      setIsRefreshing(false);
    }, 3000);
  }
}


useEffect(() => {
  if (isRefreshing) {
    Animated.timing(extraPaddingTop, {
      toValue: refreshingHeight,
      duration: 0,
      useNativeDriver: false,
    }).start();
    lottieViewRef.current?.play();
  } else {
    Animated.timing(extraPaddingTop, {
      toValue: 0,
      duration: 400,
      easing: Easing.elastic(1.3),
      useNativeDriver: false,
    }).start();
  }
}, [isRefreshing]);


//----------------------------
 //}



    useEffect(() => {
    console.log( '-### ??????????? HomeScreen getAllPosts посты ' )        
     getAllPosts()(dispatch);
   getAllUsers()(dispatch);
   }, [dispatch]);

 // console.log( 'posts=', posts )






  
    const ppNotifi = async (tt: any) => {
      console.log( 'ppNotifi=', tt  )
      await axios.put( `${URI}/pp-notifi`,
      { isLoading },
      {  headers: { Authorization: `Bearer ${token}`, }, },
    )
  .then((res: any) => {
    console.log( 'ppNotifi =', res.data )
 // navigation.goBack()
  //   getAllPosts()(dispatch) 

  });


  }

   console.log( '---HomeScreen   проверка  users=', users )

  return (
    <>
 
      {
         animation ? ( 
//-----------это без анимации-----при const animation = true --------------------
 isLoading ? (
  <>
  {/* <Text  style={tw`text-black`}> Постов = {posts?.length} </Text> */}
 
      <Loader />
 </>     
    ) : 
    (
  
    <SafeAreaView>      
        <Text  style={tw`text-black`}> Постов = {posts?.length} </Text> 
            {/* <TouchableOpacity  onPress={()=>ppNotifi(user?.name) }   >
             <View style={tw`pl-3`} >
        <Text style={tw`text-black text-5 bg-[#707cec]`}>
           {user?.name}      --это   HomeScreen +  </Text>
           <Text  style={tw`text-black`}> Постов = {posts?.length} </Text>    
         </View>
         </TouchableOpacity> */}
     
   
       <StatusBar 
        animated={true}
        backgroundColor={"#61dafb"}
        barStyle={ 'dark-content'}
        showHideTransition={ 'fade'}
        />
           <View style={tw`mb- 1 `}
       // !!!!!   сам    нижняя часть для последнего сообщения 
           >
 
                 <FlatList
              data={posts}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => (
    <PostCard  navigation={props.navigation} item={item} />
              )}
  
          />  
    
                </View>
 
      </SafeAreaView>
    ) 


//-------------------------------------
        ):
   
   
   (
        
        isLoading ? (  <Loader />
      ) : 
      (
        <SafeAreaView>
    <TouchableOpacity  onPress={()=>ppNotifi(user?.name) }   >
            <View style={tw`pl-3`} >
       <Text style={tw`text-black text-5 bg-[#707cec]`}>
           {user?.name}  --это HomeScreen загруз  </Text>
        </View>
        </TouchableOpacity> 

       {/* уберем пока    <Lottie
            ref={lottieViewRef}
            // style={tw`  height-refreshingHeight,
            //            position-'absolute', top-15, left-1, right-1,
            //    ${display Refreshing ? 'flex' : 'none'}
            //   `}
            style={{
              height: refreshingHeight,
              display: isRefreshing ? 'flex' : 'none',
              position: 'absolute',
              top: 15,
              left: 0,
              right: 0,
            }}

            loop={false}
            source={loader}
            progress={progress}
          />
         * custom loader not working in android that's why I used here built 
          in loader for android and custom loader for android but 
          both working perfectly
          пользовательский загрузчик не работает в Android, поэтому я использовал здесь
           встроенный загрузчик для Android и пользовательский загрузчик для Android,
            но оба работают отлично
          
          */}
         {
          Platform.OS === 'ios' ? (
            <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <PostCard navigation={props.navigation} item={item} />
            )}
            onScroll={onScroll}
            onScrollEndDrag={onScrollEndDrag}
            onResponderRelease={onRelease}
            ListHeaderComponent={
              <Animated.View
              style={tw` paddingTop: extraPaddingTop `}
                
              />
            }
          />
          ) : (
            <FlatList
            data={posts}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <PostCard navigation={props.navigation} item={item} />
            )}
            onScroll={onScroll}
            onScrollEndDrag={onScrollEndDrag}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  getAllPosts()(dispatch);
                  getAllUsers()(dispatch).then(() => {
                    setRefreshing(false);
                  });
                }}
                progressViewOffset={refreshingHeight}
              />
            }
            onResponderRelease={onRelease}
            ListHeaderComponent={
              <Animated.View  style={{   paddingTop: extraPaddingTop,   }}        />
            }
          />
          )
         }
        </SafeAreaView>
      )
      )
      
      }
    </>
  );
};


export default HomeScreen



//это было до 13-25-19 и затем добавили лоадер  const loader = require('../assets/animation_lkbqh8co.json');
// return (
//   <>
//   {isLoading ? (
//     <Loader />
//   ) : (

//   <SafeAreaView>      
//           <TouchableOpacity  onPress={()=>ppNotifi(user?.name) }   >
//            <View style={tw`pl-3`} >
//       <Text style={tw`text-black text-5 bg-[#707cec]`}>
//          {user?.name}      --это   HomeScreen   </Text>
//        </View>
//        </TouchableOpacity>
//      <StatusBar 
//       animated={true}
//       backgroundColor={"#61dafb"}
//       barStyle={ 'dark-content'}
//       showHideTransition={ 'fade'}
//       />
//          <View style={tw`mb-10   `}
//      //сам    нижняя часть для последнего сообщения 
//          >

//             <FlatList
//             data={posts}
//             showsVerticalScrollIndicator={false}
//             renderItem={({item}) => (
//   <PostCard  navigation={props.navigation} item={item} />
//             )}

//         />  
     
//               </View>

//     </SafeAreaView>
//   )}
//     </>
//   )
