import axios from "axios";
import React, { useState, useEffect } from "react";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import { dataURItoBlob } from "@/libs/imageHelper";
import { uploadToStorage } from "@/libs/firebase";
/* 
    problem with CORS-ORIGIN at DVLA side 
*/
function callDVLA() {
  var config = {
    method: "post",
    url: "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
    headers: {
      "x-api-key": "iZQWpDapjy4n4DoL9Ulzm25D68rlHPFS6u3KyEag",
      "Content-Type": "application/json",
    },
    data: JSON.stringify({ registrationNumber: "GV62HKP" }),
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
}

const DVLA_check = (props) => {
  const [imgBlob, setImgBlob] = useState(null);

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
};

async function sendImageForNumberPlateDetection(imgURL) {
  console.log(imgURL);
  const url =
    "https://license-plate-detection.p.rapidapi.com/license-plate-detection";
  const options = {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "f1cbd5402amshd56e206589f3824p136381jsn24bb90cd596c",
      "X-RapidAPI-Host": "license-plate-detection.p.rapidapi.com",
      "access-control-allow-credentials": "true",
      "access-control-allow-origin": "*",
    },
    body: {
      url: "https://firebasestorage.googleapis.com/v0/b/ken-demo-d95fe.appspot.com/o/images%2FnumberPlate.png?alt=media&token=83a8c355-c1ba-477b-9687-5cf2bf066b50&_gl=1*191812*_ga*MTYzODE3OTk3OS4xNjk0NDI4NTgy*_ga_CW55HF8NVT*MTY5NzY0NTg5MS42LjEuMTY5NzY0NTg5Ny41NC4wLjA.",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

export default function checkDVLA() {
  const [imgBlob, setImgBlob] = useState(null);
  /*const [imgURL, setImgURL] = useState(null);
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
  };*/

  useEffect(() => {
    console.log(imgBlob);
    const imagePathOnStorage = "images/numberPlate.png";
    uploadToStorage(imgBlob, imagePathOnStorage).then((imgURL) => {
      // once the image stored on Firebase has reutrned a full url
      // send the link to the Rapid API for number plate detection
      sendImageForNumberPlateDetection(imgURL);
    });
  }, [imgBlob]);

  return (
    <div className="App">
      <Camera
        idealFacingMode={FACING_MODES.ENVIRONMENT}
        idealResolution={{ width: 320, height: 240 }}
        onTakePhoto={(dataUri) => {
          const blob = dataURItoBlob(dataUri);
          // this will trigger fetching with axios in useEffect
          setImgBlob(blob);
        }}
      />
    </div>
  );
}
