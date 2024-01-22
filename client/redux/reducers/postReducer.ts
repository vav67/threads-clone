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
 //    console.log( '+++++ getAllPostsSuccess action.payload=', action.payload )
      state.isLoading = false;

    // const updatedPosts = action.payload; 
    // state.posts = state.posts.map(post => {
    //         const updatedPost = updatedPosts.find(updatedPost => updatedPost._id === post._id);
    //   return updatedPost ? updatedPost : post;
    // });

    state.posts = action.payload;
})
/**
 * state.posts = action.payload; помогает postId
 * В этом коде предполагается, что action.payload содержит массив постов, 
 * полученных после успешной операции. Таким образом, если в action.payload 
 * у вас есть обновленные посты, то они присваиваются полю state.posts, 
 * заменяя предыдущее значение.
 */

//////////////////////////////////////////////////////////
/**
 * 
Если после диспетчеризации getAllPostsSuccess вам необходимо обновить отдельный
 пост в массиве постов, вы можете использовать следующий код: 
.addCase(getAllPostsSuccess, (state, action:any) => {
  state.isLoading = false;
  const updatedPosts = action.payload; // или откуда у вас приходят обновленные посты
  state.posts = state.posts.map(post => {
    const updatedPost = updatedPosts.find(updatedPost => updatedPost._id === post._id);
    return updatedPost ? updatedPost : post;
  });
})


*/
////////////////////////////////////////////////////////

  .addCase( getAllPostsFailed, (state, action:any) => {
        state.isLoading = false;
        state.error = action.payload;
  })
 

  
   .addCase(clearErrors, (state, action) => {
    state.error = null;
   
})

});
