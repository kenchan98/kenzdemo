"use client";

import { useEffect, useState, useRef } from "react";

export default function CCTV(props) {
  const refTarget = useRef(null);

  return (
    <div className="w-auto p-2 group relative">
      <div className="absolute w-full h-full flex justify-center content-center">
        <button className="bg-white m-4 p-4 h-1/4 mt-25 invisible items-center group-hover:visible">
          Request footage
        </button>
      </div>
      <video loop autoPlay muted ref={refTarget}>
        <source src={props.url} type="video/mp4" />
      </video>
    </div>
  );
}

/*<div className="video-container p-2">
      <div class="group relative bg-gray-300 m-3">
        <button
          class="transition transform  
            translate-y-8 ease-in-out invisible  
            absolute group-hover:visible pr-10  
            pl-10 pt-2 pb-2 mr-20 ml-20 bg-white  
            text-black group-hover:translate-y-0"
        >
          Request footage
        </button>
        <video loop autoPlay muted ref={refTarget}>
          <source
            src={props.url + `?random=${Math.random()}`}
            type="video/mp4"
          />
        </video>
      </div>
  </div>*/
// + `?random=${Math.random()}`
