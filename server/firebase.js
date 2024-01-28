var admin =require( "firebase-admin"); 

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
 

module.exports = {
    initializeApp,
    admin,
  };