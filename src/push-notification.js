import firebase from 'firebase';
import { topicAll, firebaseAppSenderId } from './constants';
import { subscribeInAPI } from './api';
import Swal from 'sweetalert2';

export const initializeFirebase = () => {
  firebase.initializeApp({
    messagingSenderId: firebaseAppSenderId
  });

  const messaging = firebase.messaging();

  messaging.onMessage((payload) => {
    const { notification: { click_action } } = payload;
    console.log('Message received. ', payload);
    Swal.fire({
      title: 'Hay una alerta de servicios, la estamos abriendo por ti 🕓',
      text: "Deseas abrirla?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        window.location.replace(click_action);
      }
    });
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