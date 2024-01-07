import { createSlice, createAsyncThunk, PayloadAction, AsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { URI } from './URI';

// export interface Item {
//   _id: string;
//   name: string;
// }



export interface Item   {
    isAuthenticated: boolean,
    loading: boolean,
    isLoading: boolean,
    user: {},
    users: [],
    token:string,
     error: string,
  };

//type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

//type PendingAction = ReturnType<GenericAsyncThunk['pending']>
//type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
//type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>



  //DataState extends Array<Item> {}

// export const fetchData = createAsyncThunk('data/fetchData', async () => {
//   try {
//     const response = await axios.get<Item[]>('http://your-database-url/api/data');
//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// });

//{name: string, email: string, password: string, avatar: string}
export const registerUser = createAsyncThunk( 'data/registerUser',  async() => {
  //async (dispatch: Dispatch<any>) => {
   
  try {
 //////=  dispatch({ type: 'userRegisterRequest',  });
     const config = {headers: {'Content-Type': 'application/json'}};
  const {data} = await axios.post( `${URI}/registration`,
        {name, email, password, avatar},
        config,
      );
    //диспатчим успех регистрации   
 //////=     dispatch({ type: 'userRegisterSuccess', payload: data.user,  });
      return data
      /////await AsyncStorage.setItem('token', data.token);
    } catch (error ) {
        throw error 
     //диспатчим ошибку
//////=      dispatch({ type: 'userRegisterFailed', payload: error.response.data.message,  });
    }
})



 const userSlice = createSlice({
    name: 'uuser',
   initialState: {
    isAuthenticated: false,
    loading: false,
    isLoading: false,
    user: {},
    users: [],
    token: '',
     error: null, 

   }  , //[] as DataState,
    reducers: {},
   extraReducers: (builder) => {
     builder
//*      // начало
//*  userRegisterRequest: state => {
//*    state.loading = true;
//*    state.isAuthenticated = false;   },
   .addCase(registerUser.pending, (state, action: PayloadAction<Item[]>) => {
                    state.loading = true;
                     state.isAuthenticated = false;
         })





//       .addCase(fetchData.fulfilled, (state, action: PayloadAction<Item[]>) => {
//         return action.payload;
//       })
//       .addCase(fetchData.rejected, (state, action) => {
//         console.error(action.error);
//       });
    },
  });

  export default userSlice.reducer;