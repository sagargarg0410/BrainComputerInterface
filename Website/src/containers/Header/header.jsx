import React from 'react'
import './header.css'
// import people from '../../assets/people.png'
import prosthetic_arm1 from '../../assets/prosthetic_arm1.webp'
import manbci from '../../assets/manbci.jpg'
import fashion from '../../assets/manhand.jpg'
import couple from '../../assets/IndianProsthetic.jpg'
import emotive from '../../assets/emotive.jpg'
// import manhand from '../../assets/manhand.jpg'

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
    <div className="gpt__header-content__people">
        {/* <img src={people} /> */}
        {/* <p>1,600 people requested access a visit in last 24 hours</p> */}
      </div>
   <div className ="gpt_header-content_input">
      <h1 className="gradient__text">Prosthetics(Indian Scenario)</h1>
       <div className="gpt__header-content__input">
       <p align ="justify">Discover the impactful statistics shaping India's prosthetics landscape. Media often referenced a figure of 500,000 amputees, sourced from a 2017 World Health Organization (WHO) study. A more conservative estimate of 25,000 prosthetic users, factoring in affordability and limited access, stems from a 2019 report by the O&P Virtual Library. The Indian government's 2018 survey revealed a staggering 9 million individuals with mobility disabilities, underlining the significant demand for prosthetics. Despite strides, challenges like limited awareness persist, requiring collaborative efforts from government, NGOs, and the private sector to enhance affordability, innovation, and prosthetic care across the nation.</p>
       </div>
      </div>
      <div className="gpt__header-content__people">
        {/* <img src={people} /> */}
        {/* <p>1,600 people requested access a visit in last 24 hours</p> */}
      </div>

      <div className ="gpt_header-content_input">
      <h1 className="gradient__text"> Emotiv headset insights for EEG</h1>
       <div className="gpt__header-content__input">
       <p align ="justify">Welcome to the Emotiv Insight 2.0, a 5-channel EEG headset crafted for education, meditation, gaming, and entertainment. Boasting dry electrodes for a hassle-free setup, it offers a resolution of 16 bits per channel and a sampling rate of 128Hz. Weighing just 53g, it's both lightweight and adjustable, ensuring comfort during extended use. With Bluetooth Low Energy connectivity, up to 5 hours of battery life, and game compatibility, it's your gateway to affordable and accessible brain-computer interfaces. Elevate your meditation, focus training, and gaming experiences effortlessly.</p>
       </div>   
      </div>

      </div> 
     
   <div  className="gpt__header-image">
      <img alt='anshu' src={prosthetic_arm1}  />
      {/* <App/> */}
      <img className="bci" alt='anshu' src={manbci}  />
      <img className="bci" alt='anshu' src={fashion}  />
      <img className="bci" alt='anshu' src={couple}  />
      <img className="bci" alt='hover' src={emotive}  />
    </div>
    
      
      
   </div>
   
  )
}

export default Header