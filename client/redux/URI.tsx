//export const URI = 'http://192.168.31.85:8000/api/v1'; 
//14-04-33 заменим на  
//////////import {Platform} from 'react-native';

let URI = '';

/////if (Platform.OS === 'ios') { //на наш адрес https://threads-clo.vercel.app/
 //URI = 'https://threads-clo.vercel.app/api/v1';
/////} else {
  //это интернет
            // URI = 'https://threads-20.vercel.app/api/v1';
/////}

//1-45-25 это на потом
/////if (Platform.OS === 'ios') {
////  это локально не пошло   
// URI = 'http://localhost:8000/api/v1';
//// } else {
 //это локально 
 //URI = 'http://192.168.31.85:8000/api/v1';
////}
 

  //это интернет
        //    URI = 'https://threads0.vercel.app/api/v1';
 //это локально 
 URI = 'http://192.168.31.85:8000/api/v1';


export {URI};