import * as React  from 'react'
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import  {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
 import ImagePicker, {ImageOrVideo} from 'react-native-image-crop-picker';
  import {createPostAction, getAllPosts} from '../../redux/actions/postAction';
 


import tw from 'twrnc';


type Props = {
  navigation: any;
};

const PostScreen = ({navigation}: Props) => {
//берем нашего пользователя
  const {user} = useSelector((state: any) => state.user);

  // Посты записаны и идет загрузка постов
 // const {post} = useSelector((state: any) => state.post);
 const {isSuccess, isLoading} = useSelector((state: any) => state.post);

//массив постов 
 // const [post, setPost] = useState([{title: '', image: '', user,},]);

//активный индекс
  const [activeIndex, setActiveIndex] = useState(0);
//и вместо поста нам нужно писать в ответах (replies) к посту, а не опубликовывать
  
  //лмйк и  сделать активным
  const [active, setActive] = useState(false);

  const dispatch = useDispatch();
//титульный заголовок
  const [title, setTitle] = useState('');
 // и изображение 
  const [image, setImage] = useState('');

 //набор ответов
 const [replies, setReplies] = useState([{title: '', image: '', user,},]);




  useEffect(() => {
   //в первый раз когда наш компонент загружается, 
   //наверное типа инициализировать
    if (   replies.length === 1 &&  
           replies[0].title === '' && 
           replies[0].image === ''
      ) {setReplies([])} 
      // {  setPost([{title: '', image: '', user}]);  }

    if (isSuccess) //если посты загружены
     {   
       navigation.goBack(); //переходим обратно
       console.log( '-### PostScreen getAllPosts обновляем посты ' )    
      getAllPosts()(dispatch);//и обновляем посты
       }
    
 //очищаем поля для ввода нового поста
       setReplies([]);
     setTitle('');
     setImage('');
 
  }, [ isSuccess   ]);         
      

  const handleTitleChange = (index: number, text: string) => {
    setReplies(prevPost => {
          const updatedPost = [...prevPost];
          updatedPost[index] = {...updatedPost[index], title: text};
             return updatedPost;
           });
     };

     // загрузка изображения
     const uploadImage = (index: number) => {
      ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        compressImageQuality: 0.9, //сжатие
        includeBase64: true,
      }).then((image: ImageOrVideo | any) => {
        if (image) {
          setReplies(prevPost => {
            const updatedPost = [...prevPost];
            updatedPost[index] = {
              ...updatedPost[index],
              image: 'data:image/jpeg;base64,' + image?.data,
            };
            return updatedPost;
          });
        }
      });
    };
 
//новый replies
const addNewThread = () => {
  if ( replies[activeIndex].title !== '' || replies[activeIndex].image !== ''
  ) {
    setReplies(prevPost => [...prevPost, {title: '', image: '', user}]);
    setActiveIndex(replies.length); //установим активный индекс
  }
};
//удалить пост
const removeThread = (index: number) => {
  if (replies.length > 0) {
    const updatedPost = [...replies];
    updatedPost.splice(index, 1);
    setReplies(updatedPost);  //добавим обновленный пост в ответы
    setActiveIndex(replies.length - 1); //активируем
  }  else {
    setReplies([{title: '', image: '', user}]);
   }
};

//добавить в ветку свежие новости(данные)
const addFreshNewThread = () => {
  if (title !== '' || image !== '') {
    setActive(true);
    setReplies(prevPost => [...prevPost, {title: '', image: '', user}]);
    setActiveIndex(replies.length); //установим активный индекс
  }
};

const postImageUpload = () => {
  ImagePicker.openPicker({
    width: 300,
    height: 300,
    cropping: true,
    compressImageQuality: 0.8,
    includeBase64: true,
  }).then((image: ImageOrVideo | any) => {
    if (image) {
      setImage('data:image/jpeg;base64,' + image.data);
    }
  });
};

//ПУБЛИКУЕМ ВНОВЬ СОЗДАННЫЙ ПОСТ
const createPost = () => {            
    if (title !== '' || (image !== '' && !isLoading)) {
      createPostAction(title, image, user, replies)(dispatch);
    }
   
}

  return (
    <SafeAreaView  style={tw` flex-1   `}>
    
    <View style={tw`pl-3`} >
      <Text style={tw`text-black text-5 bg-[#707cec]`}>
         {user?.name}      --это   экран PostScreen </Text>
       </View>

      <View   style={tw`w-full flex-row items-center m-3`}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
  source={{ 
     uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png', 
        }}
              style={{  
                 width: 20,   
                 height: 20, 
                    }}   />
          </TouchableOpacity>
          <Text    style={tw`pl-4 font-600 text-7 text-[#000]`}  >
            New Thread  Новая Тема
          </Text>
          </View>     

   <ScrollView  showsVerticalScrollIndicator={false}   >
      <View style={tw`m-3 flex-1 justify-between`}>
      <View>
     {/* 
------это начинается пост ------------------------------------     
     crete post */}     

<View style={tw`mt-3 flex-row` }>
<Image source={{uri: user?.avatar?.url}}
style={{   width: 40,   height: 40,   }} 
 borderRadius={100}
 /> 
<View style={tw`pl-3   `   }>
<View style={tw`w-70% flex-row   justify-between  ` }>
    <Text     //имя пользователя     
            style={tw`text-5 font-500  text-black` }>
       {user?.name}
       </Text>
 <TouchableOpacity >
    <Image
source={{  
 uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png',  }}
style={{   width: 20,   height: 20,    }}   />
 </TouchableOpacity>
</View>

<TextInput
placeholder="Start a thread... Тема начало"
placeholderTextColor={'#000'}
value={ title}
      onChangeText={text => setTitle(text)}
style= {tw`mt-1 text-[#000] text-4  `   }  
/>
   <TouchableOpacity style={tw`mt-2`  }
      onPress={postImageUpload} //опубликовать изображение
          >
 <Image
source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png',  }}
   style={{   width: 20,   height: 20,    }}   
   tintColor={"#000"}
   />
  </TouchableOpacity>
</View>
</View>
{  image && (
          <View style={tw`m-2`  }>
       <Image   
       source={{uri: image}}
     width={200}
     height={300}
     resizeMethod="auto"
     alt=""
             />
 </View>
 )}
    {/*   
// если наших ответов нет         */}    
   {replies.length === 0 && (  // тогда отобразить только это
<View  
style={tw` font-600 text-[#555458] flex-row m-3 w-full items-start mt-5 opacity-51`}
   >
<Image
         source={{uri: user?.avatar?.url}}
         style={{width: 30, height: 30}}
          borderRadius={100}
           />
<Text style={tw`pl-3 font-600  `}
              onPress={addFreshNewThread} >
                Здесь пиши свой ответ Add to thread 
         </Text>
    </View>
)} 

      {/*  ---------создание ответов-----------------------------------     
     crete replies */}      

   {replies.map((item, index) => (
           <View                  // пройдемся по ответа поста    
         key={index}>

    <View style={tw`mt-3 flex-row` }>
               <Image source={{uri: user?.avatar?.url}}
               style={{   width: 40,   height: 40,   }} 
                borderRadius={100}
                /> 
        <View style={tw`pl-3   `    }>
                    <View style={tw`w-70% flex-row   justify-between  ` }>
                   <Text
     //имя пользователя              
                   style={tw`text-5 font-500  text-black` }>
                           {user?.name}
                      </Text>
                <TouchableOpacity          //удаление ответа        
                      onPress={() => removeThread(index)}    >
                   <Image
             source={{  
                uri: 'https://cdn-icons-png.flaticon.com/512/2961/2961937.png',
                }}
              style={{   width: 20,   height: 20,    }}  
                 />
                </TouchableOpacity>
             </View>
              <TextInput
              placeholder="Start a thread...  ответ"
              placeholderTextColor={'#000'}
              value={item.title}
              onChangeText={text => handleTitleChange(index, text)}
              style= {tw`mt-2 text-[#000] text-4  ` }  
            />
              <TouchableOpacity   style={tw`mt-2`  }
                        onPress={() => uploadImage(index)}>
                <Image
   source={{ uri: 'https://cdn-icons-png.flaticon.com/512/10857/10857463.png',  }}
                  style={{   width: 20,   height: 20,    }} 
                />
                 </TouchableOpacity>
           </View>
     </View>
             { item.image && (
                <View style={tw`m-2`  }>
                    <Image  
                        source={{uri: item.image}}
                         width={200}
                         height={300}
                         resizeMethod="auto"
                           alt=""
                      />
                </View>
               )}
   
   {   index === activeIndex && (
  <View  style={tw` font-600 text-[#6514e7]   flex-row m-3 w-full items-start mt-5 opacity-67`}
       >
      <Image
          source={{uri: user?.avatar?.url}}
          style={{width: 30, height: 30}}
          borderRadius={100}
           />
       <Text style={tw`pl-3 font-600 text-[#191d1d]`}
            onPress={addNewThread}>
            Add to thread ...здесь будут их ответы
       </Text>
    </View>
     )} 
   </View>
       ))} 
   
    {/** конец прохода по ответам */} 
   
    </View>

    </View>
    </ScrollView>

     <View style={tw`p-2 flex-row justify-between`}>
          <Text style={tw`text-black px-1 py-1`}>
                    Anyone can reply Любой может ответить</Text>
         <TouchableOpacity    onPress={createPost}   >
             <Text style={tw` text-[#1977f2]`}>Post(Опубликовать)  </Text>
        </TouchableOpacity>
     </View>


  </SafeAreaView>
  )
}

export default PostScreen

 