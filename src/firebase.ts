import firebase from "firebase/app";
import "firebase/messaging";
import { firebaseConfig } from './constants';

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

let messaging: firebase.messaging.Messaging;

if (typeof window !== "undefined") {
    if (firebase.messaging.isSupported()) {
        messaging = firebase.messaging();
    }
}

export const getMessagingDeviceToken = async () => {
    let currentToken = "";
    if (!messaging) return;
    try {
        currentToken = await messaging.getToken({
            vapidKey: "BGu8h6ldSab2I6yJQXsUNNn-yvki3f_4ikbXtmW9PCUeDbERHmjCi4CSl9cGWbvUF7N1k2hVtLhMSTAKb0TEoSM",
        });
        console.log("FCM registration token", currentToken);
    } catch (error) {
        console.log("An error occurred while retrieving token. ", error);
    }
    return currentToken;
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });
