// notificationsController.js

const connectDb = require("../db/db");
const { admin } = require("../firebase");

 

const soobadm = async (mytokenFirebase, ttitle, bbody, dd) => {
  try {
    // Соединение с базой данных
    await connectDb();

    if (!global.firebaseInitialized) {
      // Если Firebase не был инициализирован, инициализируем его
      admin.initializeApp();
      global.firebaseInitialized = true;
    }

    // Остальная часть вашей функции soobadm

    let result = await admin.messaging().sendEachForMulticast({
      tokens: [mytokenFirebase],
      notification: {
        title: ttitle,
        body: bbody,
      },
      data: {
        ousername: dd.ousername,
      },
      android: {
        priority: 'high',
      },
    });

    // Вернуть результат
    return result;
  } catch (error) {
    console.error('Ошибка ф-я soobadm:', error);
    throw error; // Пробросить ошибку вверх для обработки в контроллере
  }
};

module.exports = soobadm;
