import React, { useState, useEffect } from "react";
import axios from "axios";
import Camera, { FACING_MODES } from "react-html5-camera-photo";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, uploadBytes, getDownloadURL, ref } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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
const storageRef = ref(storage);

function uploadToStorage(img) {
  const numPlate = ref(storage, "images/numberPlate.jpg");
  uploadBytes(numPlate, img).then((snapshot) => {
    getDownloadURL(ref(storage, numPlate)).then((url) => {
      console.log(url);
    });
  });
}
const DVLA_check = (props) => {
  const [imgBlob, setImgBlob] = useState(null);

  function callDVLA() {
    var data = JSON.stringify({ registrationNumber: "GV62HKP" });

    var config = {
      method: "post",
      url: "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      headers: {
        "x-api-key": "iZQWpDapjy4n4DoL9Ulzm25D68rlHPFS6u3KyEag",
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function sendImageByte() {
    const encodedParams = new URLSearchParams();
    encodedParams.set("image_bytes", imgBlob);

    const options = {
      method: "POST",
      url: "https://openalpr.p.rapidapi.com/recognize_bytes",
      params: {
        country: "GB",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "f1cbd5402amshd56e206589f3824p136381jsn24bb90cd596c",
        "X-RapidAPI-Host": "openalpr.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function sendImage() {
    const url =
      "https://license-plate-detection.p.rapidapi.com/license-plate-detection";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "f1cbd5402amshd56e206589f3824p136381jsn24bb90cd596c",
        "X-RapidAPI-Host": "license-plate-detection.p.rapidapi.com",
      },
      body: imgBlob,
      //url: "https://cms.regtransfers.co.uk/api/assets/regtransfers-blog/67201a24-b5df-4da8-ad83-a0b495ca32de/tp-masonry.jpg?sq=84b0ac07-c13f-7785-884b-ab672d9ad3f1",
    };

    try {
      const response = await fetch(url, options);
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }

  function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ab], { type: mimeString });
    return blob;
  }

  useEffect(() => {
    // send captured image to roboflow "camera" model for recognition
    /*
    const fetchData = async () => {
      const response = await fetch(
        "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
        {
          method: "POST",
          headers: {
            "x-api-key": "iZQWpDapjy4n4DoL9Ulzm25D68rlHPFS6u3KyEag",
          },
          data: JSON.stringify({ registrationNumber: "GV62HKP" }),
        }
      );
      const newData = await response.json();
      console.log(newData);

      // THIS FETCH WORKS
      /*fetch("https://gohapi-1234.firebaseio.com/testing.json")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
       
    };

    fetchData(); */
    //callDVLA();
    //sendImage();
    //sendImageByte();
    uploadToStorage(imgBlob);
    //console.log(imgBlob);
  }, [imgBlob]);

  async function handleTakePhoto(dataUri) {
    console.log(dataUri);
    //
    const blob = dataURItoBlob(dataUri);
    // this will trigger fetching with axios in useEffect
    setImgBlob(blob);
    //setImgBlob(dataUri);
    /*const data = new FormData();
      const blob = dataURItoBlob(dataUri);
      data.append("image_file", blob, "image_file");
      const response = await fetch("/detect", {
        method: "post",
        body: data,
      });
      */
  }

  return (
    <>
      <Camera
        idealFacingMode={FACING_MODES.ENVIRONMENT}
        idealResolution={{ width: 240, height: 240 }}
        //isFullscreen={true}
        onTakePhoto={(dataUri) => {
          handleTakePhoto(dataUri);
        }}
      />
    </>
  );
};

function DemoDVLA() {
  const [isCaptured, setIsCaptured] = useState(false);
  const [cameraDetected, setCameraDetected] = useState("");
  const [cameraPosition, setCameraPosition] = useState(null);

  const cameraPressed = (bool) => {
    setIsCaptured(bool);
  };

  const reset = () => {
    setIsCaptured(false);
    setCameraDetected("");
    setCameraPosition(null);
  };

  useEffect(() => {
    console.log(cameraPosition);
  }, [cameraPosition]);

  return (
    <div className="App">
      <DVLA_check
        cameraPressed={cameraPressed}
        setCameraDetected={setCameraDetected}
        setCameraPosition={setCameraPosition}
      />

      <div className="result">{cameraDetected}</div>
    </div>
  );
}

export default DemoDVLA;
