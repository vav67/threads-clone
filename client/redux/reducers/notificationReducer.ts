 
import {createAction, createReducer} from '@reduxjs/toolkit';

 
const intialState = {
  isLoading: true,
  error: null,
  notifications: [],
};

const getNotificationRequest = createAction('getNotificationRequest')
const getNotificationSuccess = createAction('getNotificationSuccess')
const getNotificationFailed = createAction('getNotificationFailed')

const clearErrors = createAction('clearErrors')

export const notificationReducer = createReducer(intialState,
 (builder) => {
   builder

   .addCase(getNotificationRequest, (state, action) => {
    state.isLoading = true;
           })
//export const notificationReducer = createReducer(initialState, {
 // getNotificationRequest: state => {
 //   state.isLoading = true;
 // },

  .addCase(getNotificationSuccess, (state, action:any) => {
     state.isLoading = false;
     state.notifications = action.payload;
   })
 // getNotificationSuccess: (state, action) => {
//    state.isLoading = false;
//    state.notifications = action.payload;
//  },

.addCase(getNotificationFailed, (state, action:any) => {
  state.isLoading = false;
  state.error = action.payload;
     })
//  getNotificationFailed: (state, action) => {
//    state.isLoading = false;
//    state.error = action.payload;
 // },
 .addCase(clearErrors, (state, action) => {
  state.error = null;
        })
 //clearErrors: state => {  state.error = null;  },


});
