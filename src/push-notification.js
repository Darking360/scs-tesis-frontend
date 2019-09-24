import firebase from 'firebase';
import { topicAll, firebaseAppSenderId } from './constants';
import { subscribeInAPI } from './api';

export const initializeFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: firebaseAppSenderId
  });

  const messaging = firebase.messaging();

  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    // ...
  });
}

export const askForPermissioToReceiveNotifications = async () => {
  try {
    const messaging = firebase.messaging();
    await messaging.requestPermission();
    const token = await messaging.getToken();
    console.log('Token:', token);
    await subscribeInAPI(topicAll, token);
    return token;
  } catch (error) {
    console.error(error);
    return null;
  }
}