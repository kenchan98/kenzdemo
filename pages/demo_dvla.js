import React, { useState, useEffect } from "react";
import axios from "axios";
import Camera, { FACING_MODES } from "react-html5-camera-photo";

const DVLA_check = (props) => {
  const [imgBlob, setImgBlob] = useState(null);

  useEffect(() => {
    // send captured image to roboflow "camera" model for recognition
    axios({
      method: "POST",
      mode: "no-cors",
      //url: "https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      url: "https://uat.driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles",
      headers: {
        "x-api-key": "HowYkRxFOQ196qWBr5H3AaqCzbcFWOgw82aB1N3M", // "iZQWpDapjy4n4DoL9Ulzm25D68rlHPFS6u3KyEag",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ registrationNumber: "GV62HKP" }),
    })
      .then(function (response) {
        console.log(response.data);
        //setIsCaptured(true);
        if (response.data.predictions.length > 0) {
          props.setCameraDetected("Number Plate detected");
          props.setCameraPosition(response.data.predictions[0]);
        } else {
          props.setCameraDetected("No Number Plate!!");
          props.setCameraPosition(null);
        }
        props.cameraPressed(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [imgBlob]);

  async function handleTakePhoto(dataUri) {
    //
    // this will trigger fetching with axios in useEffect
    setImgBlob(dataUri);
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

function Demo3() {
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

export default Demo3;
