import Cortex from './Facial_Data_Fetch'

import React, { useState, useEffect } from 'react';
import smile from '../../assets/smile.jpg'
import wink from '../../assets/wink.jpg'
import neutral from '../../assets/neutral.jpg'


  const ImageComponent = () => {

  // Determine which image to display based on the fetched emotion string
  const getImageSource = () => {

    const socketUrl = 'wss://localhost:6868'
    let user =
    {
      "license": "",
      "clientId": "97LUk91NH5vW1Wul5dcyWOWfcJ4tDvX28frCx5pC",
      "clientSecret": "GH0A2vlp52by1zRil1INUP5vg9oLIPFBaCzMuwN1vXdA1qPrYt9ARcNse3kc9ZsRI7SfPUwCBWccB7RcGEngs6fJLhmaV1r7jKxpyqltvWXIxWAyM4LdMj3NOTSRF9nT",
      "debit": 1
    }

    let c = new Cortex(user, socketUrl)

    let streams = ['fac']

    //Loop here
    c.sub(streams)

    const eyes =  c.geteyeAction();
    //const UFace = c.getuAct();
    //const LFace = c.getlAct();

    switch ('smile') {
      case 'smile':
        return smile; // Replace with the actual path to your smile image
      case 'blink':
        return wink; // Replace with the actual path to your neutral image
      default:
        return neutral; // Replace with the actual path to a default image or handle other cases
    }
  };

  return (
    <div>
      <img src={getImageSource()} alt="Emotion Image"  />
    </div>
  );
};

export default ImageComponent;