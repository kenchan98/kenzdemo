import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Camera, { FACING_MODES } from "react-html5-camera-photo";

export default function checkNumberPlate() {
  console.log("----------");
  console.log(process.env.PLATE_RECOGNIZER_KEY);
  //const appContext = useContext(AppContext);
  const [imgData, setImgData] = useState(null);
  const [plateNumber, setPlateNumber] = useState("");
  const [registerDate, setRegisterDate] = useState("");
  const [vehicleTaxStatus, setVehicleTaxStatus] = useState("");
  const [make, setMake] = useState("");
  const [colour, setColour] = useState("");
  const [motExpiryDate, setMotExpiryDate] = useState("");
  const [motStatus, setMotStatus] = useState("");

  useEffect(() => {
    //request_VehicleCheck();
    //request_Platebber(imgData);
    if (imgData) request_PlateRecognizer(imgData);
  }, [imgData]);

  /*



  */
  /*
    =============================================================
    upload the image taken with the camera to firebase for storage
 */
  function uploadToFirebaseStorage() {
    const imagePathOnStorage = "images/numberPlate.png";
    uploadToStorage(imgData, imagePathOnStorage).then((imgURL) => {
      // once the image stored on Firebase has returned a full url
      // send the link to the Rapid API for number plate detection
      sendImageForNumberPlateDetection(imgURL);
    });
  }
  /* 
    =================================
    sending a request to local server
    in turn to make a request at DVLA
  */
  function request_DVLA(plateNum) {
    fetch("/api/dvla", {
      method: "POST",
      body: JSON.stringify({
        plateNum: plateNum,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        console.log(JSON.parse(data.data));
        const {
          registrationNumber,
          taxStatus,
          monthOfFirstRegistration,
          colour,
          make,
          motExpiryDate,
          motStatus,
        } = JSON.parse(data.data);
        setPlateNumber(registrationNumber);
        setRegisterDate(monthOfFirstRegistration);
        setVehicleTaxStatus(taxStatus);
        setMake(make);
        setColour(colour);
        setMotExpiryDate(motExpiryDate);
        setMotStatus(motStatus);
      });
  }
  /*
      ===========================================
      send image64Base to PLatebber for detection
      X X needs to be on a Heroku server
  */
  function request_Platebber(imgData) {
    let url =
      "https://cors-anywhere.herokuapp.com/https://www.de-vis-software.ro/platebber.aspx";
    let username = "ken chan";
    let password = "Plate!2367";
    var data = {
      base64ImageString: imgData,
      languageCode: "auto",
      plate_output: "no",
    };

    var x = new XMLHttpRequest();
    x.open("POST", url);
    x.setRequestHeader(
      "Authorization",
      "Basic " + window.btoa(username + ":" + password)
    );
    x.setRequestHeader("Content-Type", "application/json");
    x.setRequestHeader("Accept", "application/json");
    x.onload = x.onerror = function () {
      if (x.status == 200 && x.statusText == "OK") console.log(x.responseText);
      else console.log("Error"); // error of 403 (Forbidden) needs to be on Heroku server
    };
    x.send(JSON.stringify(data));
  }
  /*
      ===================================================================
      call rapid API with image stored in Firebase to check for detection
      X X currently comes back with a unprocessable content
  */
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
  /*
      =======================================================
      request to vehicle-check.co.uk with registration number
      X X premium service for checking vehicles
  */
  function request_VehicleCheck() {
    try {
      fetch(
        "https://dvlasearch.appspot.com/DvlaSearch?apikey=DvlaSearchDemoAccount&licencePlate=GV62HKP"
      )
        .then((response) => response.json())
        .then((data) => console.log(data));
    } catch (err) {
      console.log(err);
    }
  }
  /*
      ===============================
      send request to Plate Recognizer
  */
  function request_PlateRecognizer(imgData, secretKey) {
    let body = new FormData(); //formdata object
    body.append("upload", imgData);
    fetch("https://api.platerecognizer.com/v1/plate-reader/", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.NEXT_PUBLIC_PLATE_RECOGNIZER_KEY}`, //925de5e38a4e63269810ab02ec9fb9165054ef85 //ea0bf1239544fa0659cf6518052918dab10bac32",
      },
      body: body,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.results.length > 0) {
          const plateNum = json.results[0].plate.toUpperCase();
          //setPlateNumber(plateNum);
          request_DVLA(plateNum);
        } else {
          setPlateNumber("No vehicle detected");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  /*


  */
  return (
    <div className="App">
      <Camera
        idealFacingMode={FACING_MODES.ENVIRONMENT}
        idealResolution={{ width: 320, height: 240 }}
        onTakePhoto={(dataUri) => {
          /*
          const blob = dataURItoBlob(dataUri);
          // this will trigger fetching with axios in useEffect
          setImgData(blob);
          */
          setImgData(dataUri);
        }}
      />
      {plateNumber && (
        <div>
          <div className="text-5xl p-10">{plateNumber}</div>
          <div className="text-2xl p-2">
            {make} : {colour}
          </div>
          <div className="text-2xl p-2">Register Date : {registerDate}</div>
          <div className="text-2xl p-2">Tax Status : {vehicleTaxStatus}</div>
          <div className="text-2xl p-2">MOT Status : {motStatus}</div>
          <div className="text-2xl p-2">MOT Expiry Date : {motExpiryDate}</div>
        </div>
      )}
    </div>
  );
}
