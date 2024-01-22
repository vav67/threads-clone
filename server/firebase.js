//https://answers.netlify.com/t/how-to-add-a-json-file-to-my-site-without-adding-it-to-github/82468
const serviceAccount = {
    type: process.env.FIR_TYPE ,
    project_id: process.env.FIR_PROJECT_ID,
    private_key_id: process.env.FIR_PRIVATE_KEY_ID ,
    private_key: process.env.FIR_PRIVATE_KEY.replace(/\\n/gm, "\n"), 
    client_email: process.env.FIR_CLIENT_EMAIL,
    client_id: process.env.FIR_CLIENT_ID,
    auth_uri: process.env.FIR_AUTH_URI,
    token_uri: process.env.FIR_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIR_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url:process.env.FIR_CLIENT_509_CERT_URL,
    universe_domain: process.env.FIR_UNIVERSE_DOMAIN
  }

// import * as admin from 'firebase-admin';
// //https://stackoverflow.com/questions/59726667/firebase-admin-sdk-global-app-initialization-in-node-js

// // Initialize our project application
// admin.initializeApp();

// // Set up database connection
// const firestoreDb: FirebaseFirestore.Firestore = admin.firestore();
// firestoreDb.settings({ timestampsInSnapshots: true });
// export const db = firestoreDb;
// module.exports = admin

var admin =require( "firebase-admin"); 

//var serviceAccount =require( "path/to/serviceAccountKey.json"); 
//var serviceAccount =require( "./threads-starting-firebase-adminsdk-6ji17-1e0f991d95.json"); 


// Здесь инициализируем глобальную переменную
global.firebaseInitialized = false;  //добавим



  const initializeApp = () => {
   // initializeApp()
 if (!global.firebaseInitialized) {    //добавим 
  admin.initializeApp({
   // учетные данные: администратор.учетные данные .серт(serviceAccount)
   credential: admin.credential.cert(serviceAccount),
  });
  global.firebaseInitialized = true;  //добавим

       }
  }

// Функция инициализации Firebase
// function initializeFirebase() {
//   if (!global.firebaseInitialized) {
//     initializeApp(); // Инициализируем Firebase приложение только, если не было инициализации ранее
//     global.firebaseInitialized = true; // Устанавливаем флаг, что Firebase был инициализирован
//   }
// }



module.exports = {
    initializeApp,
   // initializeFirebase,
    admin,
  };