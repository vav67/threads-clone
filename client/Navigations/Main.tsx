import * as React  from 'react';
import  {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Tabs from "./Tabs";
import UserProfileScreen from '../src/screens/UserProfileScreen' 
import CreateRepliesScreen from '../src/screens/CreateRepliesScreen'

  import PostDetailsScreen from "../src/screens/PostDetailsScreen";
  import PostLikeCard from '../src/components/PostLikeCard';
 import FollowerCard from '../src/components/FollowerCard';
 import EditProfile from "../src/components/EditProfile";
import Quserprofilescreen from '../src/screens/Quserprofilescreen'; //сам 


type Props = {};

const Main = (props: Props) => {
  const Stack = createNativeStackNavigator() 

  return (
    <Stack.Navigator
    // initialRouteName="Homeq"
   // по умолчанию и так первый отображается , но надо другое имя
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Tabs} />
      <Stack.Screen name="UserProfile" component={UserProfileScreen} />
      <Stack.Screen name="CreateReplies" component={CreateRepliesScreen} />
   <Stack.Screen name="PostDetails" component={PostDetailsScreen} />
   <Stack.Screen name="PostLikeCard" component={PostLikeCard} />
   <Stack.Screen name="FollowerCard" component={FollowerCard} />
    <Stack.Screen name="EditProfile" component={EditProfile} />   
    <Stack.Screen name="QUserProfile" component={Quserprofilescreen} />   
    

    </Stack.Navigator>
  );
};

export default Main;


 
     
 