// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, uploadBytes, getDownloadURL, ref } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpwZnUGkvs_lmkq_Sfp9GI31n2iOhDvkw",
  authDomain: "ken-demo-d95fe.firebaseapp.com",
  databaseURL: "https://ken-demo-d95fe.firebaseio.com",
  projectId: "ken-demo-d95fe",
  storageBucket: "ken-demo-d95fe.appspot.com",
  messagingSenderId: "804281651334",
  appId: "1:804281651334:web:610237dc21fb4bd8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage();

export function uploadToStorage(imgData, pathName) {
  const imgOnStorage = ref(storage, pathName);
  return uploadBytes(imgOnStorage, imgData).then(() => {
    return getDownloadURL(ref(storage, imgOnStorage)).then((url) => url);
  });
}
