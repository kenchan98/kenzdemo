import React, { useState, useEffect } from "react";
import axios from "axios";
import Camera, { FACING_MODES } from "react-html5-camera-photo";

const Roboflow_NumberPlate = (props) => {
  const [imgBlob, setImgBlob] = useState(null);

  useEffect(() => {
    // send captured image to roboflow "camera" model for recognition
    axios({
      method: "POST",
      url: "https://detect.roboflow.com/alphanumeric-character-detection/1", //"https://detect.roboflow.com/nslp_complete/2",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      params: {
        api_key: "hswAlYpsqG2nymIUHsTY", //process.env.NEXT_PUBLIC_ROBOFLOW_KEY,
      },
      data: imgBlob,
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
        console.log(error.message);
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
      <Roboflow_NumberPlate
        cameraPressed={cameraPressed}
        setCameraDetected={setCameraDetected}
        setCameraPosition={setCameraPosition}
      />

      <div className="result">{cameraDetected}</div>
    </div>
  );
}

export default Demo3;
