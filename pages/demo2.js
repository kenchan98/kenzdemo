import React, { useState, useEffect } from "react";
import Camera from "../components/Roboflow_CarCrash";

function Demo2() {
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
      <Camera
        cameraPressed={cameraPressed}
        setCameraDetected={setCameraDetected}
        setCameraPosition={setCameraPosition}
      />

      <div className="result">{cameraDetected}</div>
    </div>
  );
}

export default Demo2;
