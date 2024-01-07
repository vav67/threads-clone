// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';
 
// AppRegistry.registerComponent(appName, () => App);
import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux'; // Импортируем Provider из react-redux
import App from './App';
import { name as appName } from './app.json';
//import configureStore from './path/to/configureStore'; // Замените на путь к вашему файлу конфигурации хранилища
//const store = configureStore(); // Создаем хранилище с помощью функции configureStore
import Store from './redux/Store';

const ReduxApp = () => (
  // Оборачиваем App в Provider и передаем ему хранилище
  <Provider store={Store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => ReduxApp);
