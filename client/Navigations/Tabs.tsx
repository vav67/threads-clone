import { View, Text, Image } from 'react-native'
import * as React  from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from "../src/screens/HomeScreen";
 import SearchScreen from "../src/screens/SearchScreen";
 import PostScreen from '../src/screens/PostScreen';
 import NotificationScreen from '../src/screens/NotificationScreen';
 import ProfileScreen from '../src/screens/ProfileScreen';

import tw from 'twrnc';

type Props = {}

const Tab = createBottomTabNavigator();

const Tabs = (props: Props) => {
  return (
    <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarHideOnKeyboard: true,
    }}>
          <Tab.Screen
        name="Home2"
        component={HomeScreen}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <Image
              source={{
                uri: focused
                  ? 'https://cdn-icons-png.flaticon.com/128/3917/3917032.png'
                  : 'https://cdn-icons-png.flaticon.com/128/3917/3917014.png',
              }}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? '#000' : '#c2c0c0',
              }}
            />
          ),
        })}
      />

      <Tab.Screen
        name="Search"
     component={SearchScreen}
         options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <Image
              source={{
                uri: focused
                  ? 'https://cdn-icons-png.flaticon.com/128/3917/3917132.png'
                  : 'https://cdn-icons-png.flaticon.com/128/3917/3917132.png',
              }}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? '#000' : '#c2c0c0',
              }}
            />
          ),
        })}
      />

      <Tab.Screen
        name="Post"
       component={PostScreen}
       options={({route}) => ({
     tabBarStyle: {display: route.name === 'Post' ? 'none' : 'flex'},
          tabBarIcon: ({focused}) => (
            <Image
              source={{
                uri: focused
                  ? 'https://cdn-icons-png.flaticon.com/512/10015/10015412.png'
                  : 'https://cdn-icons-png.flaticon.com/512/10015/10015412.png',
              }}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? '#000' : '#c2c0c0',
              }}
            />
          ),
        })}
      />

      <Tab.Screen
        name="Notifications"
         component={NotificationScreen}
        options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <Image
              source={{
                uri: focused
                  ? 'https://cdn-icons-png.flaticon.com/512/1077/1077086.png'
                  : 'https://cdn-icons-png.flaticon.com/512/1077/1077035.png',
              }}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? '#000' : '#c2c0c0',
              }}
            />
          ),
        })}
      />

      <Tab.Screen
        name="Profile"
      component={ProfileScreen}
     options={({route}) => ({
          tabBarIcon: ({focused}) => (
            <Image
              source={{
                uri: focused
                  ? 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png'
                  : 'https://cdn-icons-png.flaticon.com/512/1077/1077063.png',
              }}
              style={{
                width: 30,
                height: 30,
                tintColor: focused ? '#000000' : '#c2c0c0',
              }}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default Tabs;


         
//   <Image source={{uri:"https://cdn-icons-png.flaticon.com/128/3917/3917014.png", }}
    
//       style={{ width:30,height: 30, tintColor: focused ? 'red' : "#14b2dd"}} 
  
//       //style={{ width:30,height: 30, tintColor: "#14b2dd"}}
//       // style={tw`w-10 h-10    focused: text-red-600  ` }    
//  // style={tw` w-10 h-10   tintColor-red   focused: bg-[#e61616] `}
//  // tintColor='#13aa4d'
//     />
//          





