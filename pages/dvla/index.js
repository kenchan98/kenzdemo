import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import Camera, { FACING_MODES } from "react-html5-camera-photo";
import AppContext from "../AppContext";

export default function checkNumberPlate() {
  //const appContext = useContext(AppContext);
  const [imgData, setImgData] = useState(null);
  const [plateNumber, setPlateNumber] = useState("");

  useEffect(() => {
    //console.log(appContext.vehicleData);

    /*
    const imagePathOnStorage = "images/numberPlate.png";
    uploadToStorage(imgData, imagePathOnStorage).then((imgURL) => {
      // once the image stored on Firebase has returned a full url
      // send the link to the Rapid API for number plate detection
      sendImageForNumberPlateDetection(imgURL);
    });
    */

    //request_VehicleCheck();

    //request_Platebber(imgData);

    //request_DVLA();

    if (imgData) request_PlateRecognizer(imgData);
  }, [imgData]);

  /*



  */
  /* 
    =========================================
    X X problem with CORS-ORIGIN at DVLA side 
*/
  function request_DVLA() {
    var config = {
      method: "post",
      url: "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      headers: {
        //"x-api-key": "iZQWpDapjy4n4DoL9Ulzm25D68rlHPFS6u3KyEag",
        "x-api-key": "HowYkRxFOQ196qWBr5H3AaqCzbcFWOgw82aB1N3M", //test server
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
  function request_PlateRecognizer(imgData) {
    let body = new FormData(); //formdata object
    body.append("upload", imgData);
    fetch("https://api.platerecognizer.com/v1/plate-reader/", {
      method: "POST",
      headers: {
        Authorization: "Token ea0bf1239544fa0659cf6518052918dab10bac32",
      },
      body: body,
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.results.length > 0) {
          const plateNum = json.results[0].plate.toUpperCase();
          setPlateNumber(plateNum);
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
      <div className="text-5xl p-10">{plateNumber}</div>
    </div>
  );
}
