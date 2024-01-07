import {createAction, createReducer} from '@reduxjs/toolkit';
//пользовательский редюсер
const intialState = {
  isAuthenticated: false,
  loading: false,
  isLoading: false, //5-11-13 добавил
  // пока заменю на 
 // isLoading: true, //5-11-13 добавил 
  user: {},
   users: [], //5-04-22 добавил юзеров, про подписку
  token:"",  //4-37-58 добавил токен
   error: null,
   tokenfirebase:"ss", //сам добавил токен полученный от Firebase
   pproba:"start",
};

const userRegisterRequest = createAction('userRegisterRequest')
const userRegisterSuccess = createAction('userRegisterSuccess')
const userRegisterFailed = createAction('userRegisterFailed')


const userLoadRequest = createAction('userLoadRequest')
const userLoadSuccess = createAction('userLoadSuccess')
const userLoadFailed = createAction('userLoadFailed')  
 //вход в систему
const userLoginRequest = createAction('userLoginRequest')
const userLoginSuccess = createAction('userLoginSuccess')
const userLoginFailed = createAction('userLoginFailed')


 //выход из системы
 const userLogoutRequest = createAction('userLogoutRequest')
 const userLogoutSuccess = createAction('userLogoutSuccess')
 const userLogoutFailed = createAction('userLogoutFailed')


 const getUsersRequest = createAction('getUsersRequest')
 const getUsersSuccess = createAction('getUsersSuccess')  
 const getUsersFailed = createAction('getUsersFailed')

 // сам проверка прохождения
 const ppUsersError = createAction('ppUsersError')
 const ppUserToken = createAction('ppUserToken')
 const ppUserYES = createAction('ppUserYES')
 const ppUserNO = createAction('ppUserNO')
 const ppUserTokenDB = createAction('ppUserTokenDB')
 
//сам допишу токен полученный от Firebase
const getusertokenFirebase = createAction('getusertokenFirebase')


const clearErrors = createAction('clearErrors')

export const userReducer = createReducer(intialState,
  (builder) => {
    builder

    .addCase(userRegisterRequest, (state, action) => {
      // action is inferred correctly here
      state.loading = true;
    state.isAuthenticated = false;
    })

 // начало
  //userRegisterRequest: state => {
  //  state.loading = true;
  //  state.isAuthenticated = false;
 // },
  //выполнен
  // userRegisterSuccess: (state, action) => {
  //   state.loading = false;
  //   state.isAuthenticated = true;
  //   state.user = action.payload;
  // },

  .addCase(userRegisterSuccess, (state, action:any) => {
     
        state.loading = false;
       state.isAuthenticated = true;
       state.user = action.payload;
  })



  //ошибка
  // userRegisterFailed: (state, action) => {
  //   state.loading = false;
  //   state.isAuthenticated = false;
  //   state.error = action.payload;
  // },

  .addCase(userRegisterFailed, (state, action) => {
        state.loading = true;
      state.isAuthenticated = false;
  })




  // userLoadRequest: state => {
  //   state.loading = true;
  //   state.isAuthenticated = false;
  // },

  .addCase(userLoadRequest, (state, action) => {
    // action is inferred correctly here
    state.loading = true;
  state.isAuthenticated = false;
  })

  // успешная загрузка
  // userLoadSuccess: (state, action) => {
  //   state.loading = false;
  //   state.isAuthenticated = true;
  //   state.user = action.payload.user;
  //   state.token = action.payload.token;
  // },
  .addCase(userLoadSuccess, (state, action:any) => {
     
    state.loading = false;
   state.isAuthenticated = true;
   //state.user = action.payload; был этот
   //на
   state.user = action.payload.user;
   state.token = action.payload.token;  //4-40-50 добавил токен
 })


  // userLoadFailed: (state, action) => {
  //   state.loading = false;
  //   state.isAuthenticated = false;
  // },
  .addCase( userLoadFailed, (state, action) => {

        state.loading = false;  //ошибка  state.loading = true;
      state.isAuthenticated = false;
  })
 
  // userLoginRequest: state => {  
    //state.isAuthenticated = false; state.loading = true; },
  .addCase(userLoginRequest, (state, action) => {
        state.loading = true;
      state.isAuthenticated = false;
  })

  // userLoginSuccess: (state, action) => {
  //   state.isAuthenticated = true;
  //   state.loading = false;
  //   state.user = action.payload;
  // },
  .addCase(userLoginSuccess, (state, action:any) => {
     
    state.loading = false;
   state.isAuthenticated = true;
    state.user = action.payload;
  
})


  // userLoginFailed: (state, action) => {
  //   state.isAuthenticated = false;
  //   state.loading = false;
  //   state.error = action.payload;
  //   state.user = {};
  // },
  .addCase( userLoginFailed, (state, action:any) => {
      state.isAuthenticated = false;
       state.loading = false;
       state.error  = action.payload;
        state.user = {};
})


.addCase(userLogoutRequest, (state, action) => {
  state.loading = true;
})
  // userLogoutRequest: state => {state.loading = true; },

  .addCase(userLogoutSuccess, (state, action:any) => {
    state.loading = false;
   state.isAuthenticated = false;
   state.user = {};
})
  // userLogoutSuccess: state => {
  //   state.loading = false;
  //   state.isAuthenticated = false;
  //   state.user = {};
  // },

  .addCase( userLogoutFailed, (state, action:any) => {
     state.loading = false;
})
  // userLogoutFailed: state => { state.loading = false; },



  .addCase(getUsersRequest, (state, action) => {
              // console.log( 'getUsersRequest  user.state.isLoading = true')
    state.isLoading = true
  })
  // getUsersRequest: state => {
  //   state.isLoading = true;
  // },


  .addCase(getUsersSuccess, (state, action:any) => {
            // console.log( '******getUsersSuccess user.state.isLoading = false')
    state.isLoading = false;
    state.users = action.payload;
})
  // getUsersSuccess: (state,action) => {
  //   state.isLoading = false;
  //   state.users = action.payload;
  // },

  .addCase( getUsersFailed, (state, action:any) => {  
    state.isLoading = false;
    state.users = action.payload;
})
  // getUsersFailed: (state,action) => {
  //   state.isLoading = false;
  //   state.users = action.payload;
  // },




  // clearErrors: state => {
  //    state.error = null;
  //     state.isAuthenticated = false;
  //  },
   .addCase(clearErrors, (state, action) => {
    state.error = null;
  state.isAuthenticated = false;
})

 

.addCase(getusertokenFirebase, (state, action:any) => {
 // console.log( '=== РЕДЮСЕР =', action.payload )

 state.tokenfirebase = action.payload ;  //сам добавил токен полученный от Firebase
})


// сам для поиска ошибок
.addCase(ppUsersError, (state, action:any) => {
  // console.log( '=== РЕДЮСЕР =', action.payload )
   state.pproba = action.payload ;  //сам добавил токен полученный от Firebase
 })
 .addCase(ppUserToken, (state, action:any) => {
  // console.log( '=== РЕДЮСЕР =', action.payload )
   state.pproba = action.payload ;  //сам добавил токен полученный от Firebase
 })
 
 .addCase(ppUserYES, (state, action:any) => {
  // console.log( '=== РЕДЮСЕР =', action.payload )
   state.pproba = action.payload ;  //сам добавил токен полученный от Firebase
 })
 
 .addCase(ppUserNO, (state, action:any) => {
  // console.log( '=== РЕДЮСЕР =', action.payload )
   state.pproba = action.payload ;  //сам добавил токен полученный от Firebase
 })
 .addCase(ppUserTokenDB, (state, action:any) => {
  // console.log( '=== РЕДЮСЕР =', action.payload )
   state.pproba = action.payload ;  //сам добавил токен полученный от Firebase
 })

 
 
 

});
