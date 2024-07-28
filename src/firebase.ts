import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  MessagePayload,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBXX2dHPna8O-NbaWTD7ukqSTaPVA9rdy0',
  authDomain: 'cloudmessages4-2875f.firebaseapp.com',
  databaseURL:
    'https://cloudmessages4-2875f-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'cloudmessages4-2875f',
  storageBucket: 'cloudmessages4-2875f.appspot.com',
  messagingSenderId: '1021060863316',
  appId: '1:1021060863316:web:a147612fd4043fe02e24c1',
};

const vapidKey =
  'BGu8h6ldSab2I6yJQXsUNNn-yvki3f_4ikbXtmW9PCUeDbERHmjCi4CSl9cGWbvUF7N1k2hVtLhMSTAKb0TEoSM';

const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

export const getDeviceToken = async (): Promise<void> => {
  try {
    const currentToken = await getToken(messaging, { vapidKey });
    if (currentToken) {
      console.log('Current token for client:', currentToken);
      // Send the token to your server and save it
    } else {
      console.log(
        'No registration token available. Request permission to generate one.'
      );
      // Show permission UI
    }
  } catch (err) {
    console.error('An error occurred while retrieving token. ', err);
  }
};

export const onMessageListener = (): Promise<MessagePayload> =>
  new Promise((resolve) => {
    onMessage(messaging, (payload: any) => {
      resolve(payload);
    });
  });
