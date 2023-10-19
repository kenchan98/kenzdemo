import "@/styles/globals.css";
import "@/styles/camera.css";
import "@/styles/home.css";
//import AppContext from "./AppContext";
import { useState } from "react";
export default function App({ Component, pageProps }) {
  const [vehicleData, setVehicleData] = useState({ imgData: "test 1" });

  return <Component {...pageProps} />;
}
