import React, { useState, useEffect } from "react";
import axios from "axios";
import Camera, { FACING_MODES } from "react-html5-camera-photo";

const Roboflow_CarCrash = (props) => {
  const [imgBlob, setImgBlob] = useState(null);

  useEffect(() => {
    // send captured image to roboflow "camera" model for recognition
    axios({
      method: "POST",
      url: "https://outline.roboflow.com/car-damage-coco-dataset/4",
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
          props.setCameraDetected("Crash detected");
          props.setCameraPosition(response.data.predictions[0]);
        } else {
          props.setCameraDetected("No Crash!!");
          props.setCameraPosition(null);
        }
        props.cameraPressed(true);
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }, [imgBlob]);

  /*  this is useful for converting dataURI to a image blob
      but it is not needed with the latest implementation 
      
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
  */

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

export default Roboflow_CarCrash;
