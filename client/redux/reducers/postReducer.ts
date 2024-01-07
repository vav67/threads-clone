import {createAction, createReducer} from '@reduxjs/toolkit';
//пользовательский редюсер
const intialState = {
    posts:[],
    post:{},
    isSuccess:false,
    isLoading: true,
     error: null,
};

const postCreateRequest = createAction('postCreateRequest')
const postCreateSuccess = createAction('postCreateSuccess')
const postCreateFailed = createAction('postCreateFailed')

const getAllPostsRequest = createAction('getAllPostsRequest')
const getAllPostsSuccess = createAction('getAllPostsSuccess')
const getAllPostsFailed = createAction('getAllPostsFailed')
 
const clearErrors = createAction('clearErrors')

export const postReducer = createReducer(intialState,
  (builder) => {
    builder

.addCase(postCreateRequest, (state, action) => {
    state.isLoading = true;
    })
  
  .addCase(postCreateSuccess, (state, action:any) => {
    state.isLoading = false;
    state.post = action.payload;
    state.isSuccess = true;
  })

  .addCase(postCreateFailed, (state, action:any) => {
    state.isLoading = false;
    state.error = action.payload;
  })



   .addCase(getAllPostsRequest, (state, action) => {
    state.isLoading = true;
  })
  // успешная загрузка
  .addCase(getAllPostsSuccess, (state, action:any) => {
    state.isLoading = false;
    state.posts = action.payload;
})
 
  .addCase( getAllPostsFailed, (state, action:any) => {
        state.isLoading = false;
        state.error = action.payload;
  })
 

  
   .addCase(clearErrors, (state, action) => {
    state.error = null;
   
})

});
