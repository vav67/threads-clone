 
let URI = '';
let RAZRAB = '' ;  //release debug

 //**RAZRAB = 'debug'   //release debug
  RAZRAB = 'release'


//if  (RAZRAB === 'debug'  ) {
 //это локально 
// URI = 'http://192.168.31.85:8000/api/v1'
// } else {
//это интернет
URI = 'https://threads-clone-vav67.vercel.app/api/v1'
// }




export {URI,RAZRAB};
