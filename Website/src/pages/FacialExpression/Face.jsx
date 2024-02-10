
// import React from "react";


// const Face=()=>{
//     const [imageSrc, setImageSrc] = useState('');

//   const handleImageChange = () => {
//     setImageSrc('new_image_url.jpg');
//   };

//     return(
//         <div className="face">
//              <img src={imageSrc} alt="My Image" />
//       <button onClick={handleImageChange}>Change Image</button>
//         </div>
//     )

// }
// export default Face;


import React, { useState, useEffect } from 'react';
import smile from '../../assets/smile.jpg'
import wink from '../../assets/wink.jpg'
import neutral from '../../assets/neutral.jpg'


// import data from 'D:\VS code\DOM\data.json';
// import smile from '../../assets/smile.jpg'

const ImageComponent = () => {
//   const [emotion, setEmotion] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch('data');
//         const emotionData = await response.json();
//         setEmotion(emotionData);
//       } catch (error) {
//         console.error('Error fetching emotion data:', error);
//       }
//     };

//     const intervalId = setInterval(fetchData, 2000);
//     return () => clearInterval(intervalId);
//   }, []); // The empty dependency array ensures the effect runs only once after the component mounts.

  // Determine which image to display based on the fetched emotion string
  const getImageSource = () => {
    const emotion = "neutral";

    switch (emotion) {
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