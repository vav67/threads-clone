import {createAction, createReducer} from '@reduxjs/toolkit';
//пользовательский редюсер
const intialState = {
  isAuthenticated: false,
  loading: false,
  isLoading: false, //5-11-13 добавил
  // пока заменю на 
 // isLoading: true, //5-11-13 добавил 
 user: {
   followers: [{ userId:{} }],
    following: [{ userId:{} }],


   },

  //   user:{    // userr:{
  //   _id: '',
  //   mytokenFirebase:  '',
  //  name: '',
  //    userName: '',
  //   bio: '',   //////
  //   email: '',
  //   password: '',
  //   avatar: {
  //     public_id: '',
  //     url: '',
  //   },
  //   followers: [{ userId:{} }],
  //   following: [{ userId:{} }],
  //   podpisani: [{ usertoken:{} }],
  //   podpisaniNumber: 0,
  // },
//updatedAt "createdAt"

   users: [], //5-04-22 добавил юзеров, про подписку
  token:"",  //4-37-58 добавил токен
  myfirebasetoken: "", //сам из хранилища
  error: null,
  //ненужен tokenfirebase:"ss", //сам добавил токен полученный от Firebase
  // pproba:"start",  //сам происходящие действия
  pproba:["start"], 
  //  soob:{},  //сам пришло сообщение
};


const getCurrentDateTime = () => {
  const now = new Date();
  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().substring(2);
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
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
 
 const getUsersSuc = createAction('getUsersSuc')  

 const getUsersFailed = createAction('getUsersFailed')

const  subscribeUser = createAction('subscribeUser')  //на меня подписались
const  unsubscribeUser = createAction('unsubscribeUser') //от меня отписались

 // сам проверка прохождения
  const ppUser = createAction('ppUser')
 



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
     
   
   //state.user = action.payload; был этот
   //на
   state.user = action.payload.user;
   //state.userr = action.payload.user;
 
 state.token = action.payload.token;  //4-40-50 добавил токен
   if ( action.payload.myfirebasetoken === null ) {
   state.myfirebasetoken = "xxxx"
   } else {
    state.myfirebasetoken = action.payload.myfirebasetoken
   }
   
 state.loading = false;
   state.isAuthenticated = true;


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

 // это начальная проверка - аутенфикация 
  .addCase(userLoginSuccess, (state, action:any) => {
     
    state.loading = false;
   state.isAuthenticated = true;
  //  state.user = action.payload; был этот
//на
state.user = action.payload.user;
//state.userr = action.payload.user;
if ( action.payload.myfirebasetoken === null ) {
  state.myfirebasetoken = ""
  } else {
   state.myfirebasetoken = action.payload.myfirebasetoken
  }
 
  state.token = action.payload.token; //сам добавил - пока так

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
      // state.user =  { } 

        state.user = null  // {};
       // state.userr = null;
})


.addCase(userLogoutRequest, (state, action) => {
  state.loading = true;
})
  // userLogoutRequest: state => {state.loading = true; },

  .addCase(userLogoutSuccess, (state, action:any) => {
    state.loading = false;
   state.isAuthenticated = false;
  //  state.user =  { } 

    state.user = null // {};
 //  state.userr = null;
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
 //console.log( '**###################-getUsersSuccess state.users action.payload=', action.payload )           
    state.isLoading = false;
    state.users = action.payload;
})

.addCase(getUsersSuc, (state, action:any) => {
  // console.log( '******getUsersSuccess user.state.isLoading = false')
//state.isLoading = false;
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
   console.log( ' РЕДЮСЕР getusertokenFirebase=', action.payload )  
 state.myfirebasetoken = action.payload ;  //сам добавил токен полученный от Firebase
})


// сам для поиска ошибок
 .addCase(ppUser, (state, action:any) => {


  // console.log( '=== РЕДЮСЕР =', action.payload )
 ////  state.pproba = action.payload ;  //сам добавил токен полученный от Firebase
 const dateTimeString = getCurrentDateTime();
state.pproba = [...state.pproba, `${action.payload}--${dateTimeString}`];


  })

 
 
 //     const updatedUsers = users.map((userObj: any) => userObj._id === ouserid
 //     ? { //нашел на кого подписываюсь
 //         ...userObj,
 //       followers: [...userObj.followers, {ouserpodpis}], 
 //       }
 //     : userObj,any
//на меня подписались

/*
По вашему коду я вижу, что вы пытаетесь обновить массив followers в 
объекте userr. Однако, когда вы фильтруете массив внутри unsubscribeUser,
 вы обращаетесь к state.userr.followers, но вы также обновляете этот 
 массив внутри subscribeUser:
Когда вы подписываетесь на пользователя, вы добавляете нового подписчика в
 массив followers. Похоже, что после этого вы пытаетесь отфильтровать массив
  в unsubscribeUser, но ваш фильтр использует state.userr.followers, 
  который уже был изменен в subscribeUser.
*/ 

.addCase(subscribeUser, (state, action:any) => {
     //добавим айпи подписанта
   //  console.log( action.payload ,'====d0=============SUB=',state.user  )    
  // state.userr.followers = [...state.userr.followers, {
  //     userId: action.payload }];
  // вы создаете новый объект updatedUserr с обновленным массивом followers
 //  Затем вы присваиваете этот объект обратно в state.userr  
 // . Это обеспечит корректную обработку отписки в дальнейшем.
  const updatedUserr = {
    ...state.user,
     following: [...state.user.following, { "userId": action.payload }],
   };
    state.user = updatedUserr;


 //  console.log(action.payload , '===posle==============SUB=',state.user)     
 })


//const  unsubscribeUser = createAction('unsubscribeUser') //от меня отписались
//еще также unsubscribeUser 

.addCase(unsubscribeUser, (state, action:any) => {
  //добавим айпи подписанта
//   console.log(action.payload ,'====d0=============UNSUB=',state.user  )
 
  state.user.following =  state.user.following.filter(
      (fol) => fol.userId !==action.payload ) 


    //  console.log( action.payload ,'====posle=============UNSUB=',state.user  )       
})



}) 

/**
 * 
Да, в определенном смысле подход, который я предложил, относится к концепции
"чистых функций". Чистые функции - это функции, которые при заданных
 одинаковых входных данных всегда возвращают одинаковый результат, и они не 
 имеют побочных эффектов.

В вашем случае, изменение состояния напрямую внутри редюсера может 
считаться изменением состояния с побочным эффектом. Однако, создание нового 
объекта с обновленными данными и присваивание его обратно в состояние
 является более "чистым" подходом, так как он не изменяет текущее состояние,
  а создает новое.

Такой подход обеспечивает предсказуемость и управляемость вашего кода, 
что может быть полезным, особенно в контексте управления состоянием в Redux. 
Тем не менее, важно помнить, что в некоторых случаях некоторые мутации
 состояния могут быть неизбежными или даже предпочтительными, но в целом 
 стремление к чистым функциям может способствовать более понятному и легко 
 поддерживаемому коду.
-----
Определенно, иногда использование мутаций может быть удобным и
 предпочтительным в некоторых сценариях. Вот пример, который демонстрирует 
 случай, когда мутация может быть оправданной:
const initialState = {
  counter: 0,
};

const incrementCounter = (state, action) => {
  // Мутация состояния - увеличиваем значение счетчика на 1
  state.counter += 1;
};

// Редюсер, использующий мутацию
const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      // Вызываем функцию, которая мутирует состояние
      incrementCounter(state, action);
      return { ...state }; // Возвращаем новый объект состояния
    default:
      return state;
  }
};

В этом примере функция incrementCounter мутирует состояние напрямую, 
увеличивая значение счетчика. Затем редюсер возвращает новый объект состояния.
 Этот подход может быть предпочтителен, если вам нужна максимальная 
 производительность и вы уверены, что мутация не приведет к нежелательным
  побочным эффектам. Однако, в контексте Redux, который старается быть
   предсказуемым и легко отслеживаемым, часто более безопасным и 
   поддерживаемым является создание новых объектов состояния без мутаций.




 */
