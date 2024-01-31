import React from 'react'
import './header.css'
// import people from '../../assets/people.png'
import prosthetic_arm1 from '../../assets/prosthetic_arm1.webp'


const Header = () => {
  return (
   <div className='gpt__header section__padding' id='Home'>
    <div className="gpt__header-content">
      <h1 className="gradient__text">Welcome to the Future of Prosthetic Limbs</h1>
      <p align ="justify">Are you ready to witness the cutting-edge fusion of technology and humanity? Look no further. Our website is your gateway to the remarkable world of 3D printed prosthetic arms controlled using electroencephalogram (EEG) technology. </p>

      <div className="gpt__header-content__input">
      <p align ="justify">Imagine a prosthetic arm that moves with your thoughts, responds to your intentions, and feels like a natural extension of yourself. That's precisely what 3D-printed prosthetic arms controlled via EEG technology offer. At the heart of this marvel lies the seamless integration of 3D printing and the human mind.</p>
      </div>
      <div className="gpt__header-content__people">
        {/* <img src={people} /> */}
        {/* <p>1,600 people requested access a visit in last 24 hours</p> */}
      </div>
      
      <div className ="gpt_header-content_input">
      <h1 className="gradient__text">Brain-Computer Interface(BCI)</h1>
       <div className="gpt__header-content__input">
       <p align ="justify">Step into the future of interaction with our revolutionary Brain-Computer Interface (BCI) technology. Explore the extraordinary realm where your thoughts fuel innovation. Our BCI technology transcends boundaries, allowing you to seamlessly connect with devices through the power of your mind. Unleash your mind's potential and redefine possibilities in the ever-evolving landscape of human-machine interaction. Join us on a transformative journey into the limitless capabilities of BCI technology. Welcome to a new era of connectivity and discovery.</p>
       </div>   
      </div>
      <div className="gpt__header-content__people">
        {/* <img src={people} /> */}
        {/* <p>1,600 people requested access a visit in last 24 hours</p> */}
      </div>
      <div className ="gpt_header-content_input">
      <h1 className="gradient__text">3D PRINTING (OPEN SOURCE INMOOV)</h1>
       <div className="gpt__header-content__input">
       <p align ="justify">Discover InMoov, the world's first open-source 3D printed life-size robot. Replicable on standard home 3D printers, InMoov serves as a versatile platform for universities, labs, hobbyists, and makers. With its open design, life-size stature, and global community collaboration, InMoov is shaping the future of accessible and collaborative robotics.</p>
       </div>   
      </div>
   </div>
     
   <div  className="gpt__header-image">
      <img alt='anshu' src={prosthetic_arm1}  />
      {/* <App/> */}
    </div>
      
   </div>
   
  )
}

export default Header