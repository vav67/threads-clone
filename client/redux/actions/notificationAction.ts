import axios from 'axios';
import {URI} from '../URI';
//import { URI } from 'redux/URI';
import {Dispatch} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// get notifications
export const getNotifications = () => async (dispatch: Dispatch<any>) => {
  try {
    //  тк просто журнал событий
    dispatch({  type: 'getNotificationRequest',    });

    const token = await AsyncStorage.getItem('token');

    const {data} = await axios.get(`${URI}/get-notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({
      type: 'getNotificationSuccess',
      payload: data.notifications,
    });
  } catch (error: any) {
    console.error('Ошибка экшен getNotifications:', error);  

    dispatch({
      type: 'getNotificationFailed',
      payload: error.response.data.message,
    });
  }
};
