import React from 'react'
import './header.css'
// import people from '../../assets/people.png'
import prosthetic_arm1 from '../../assets/prosthetic_arm1.webp'


const Header = () => {
  return (
   <div className='gpt__header section__padding' id='Home'>
    <div className="gpt__header-content">
      <h1 className="gradient__text">Welcome to the Future of Prosthetic Limbs</h1>
      <p>Are you ready to witness the cutting-edge fusion of technology and humanity? Look no further. Our website is your gateway to the remarkable world of 3D printed prosthetic arms controlled using electroencephalogram (EEG) technology. </p>


      <div className="gpt__header-content__input">
      <p>Imagine a prosthetic arm that moves with your thoughts, responds to your intentions, and feels like a natural extension of yourself. That's precisely what 3D-printed prosthetic arms controlled via EEG technology offer. At the heart of this marvel lies the seamless integration of 3D printing and the human mind.</p>
      </div>
      <div className="gpt__header-content__people">
        {/* <img src={people} /> */}
        {/* <p>1,600 people requested access a visit in last 24 hours</p> */}
      </div>
   </div>
     
   <div  className="gpt__header-image">
    
      <img src={prosthetic_arm1}  />
      {/* <App/> */}
    </div>

   </div>
  )
}

export default Header