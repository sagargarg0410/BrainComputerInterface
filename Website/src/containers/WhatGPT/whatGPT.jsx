import React from 'react'
import './whatGPT.css'
import { Feature } from '../../components'
import Mindwriting1 from '../../assets/Mindwriting1.gif'
import Mindwriting from '../../assets/Mindwriting.gif'


const WhatGPT = () => {
  return (
    <div className='gradient__bg1' id='whatgpt'>
      <div className='heading'>
        <h1>Explore the myriad possibilities our BCI technology opens up:</h1>
        {/* <p>Explore The Library</p> */}
        <div className='container_image'><img src={Mindwriting} alt="no image" /><img src={Mindwriting1} alt='no image'/></div>
      </div>
      <div className='container'>
      <Feature title="Empowering Accessibility " text="Assistive technologies powered by our BCI platform provide newfound independence for individuals with mobility challenges, allowing them to control devices and navigate the digital world with ease." />
      <Feature title="Enhanced Gaming Experience" text="Immerse yourself in a new era of gaming, where your thoughts shape the gameplay. Our BCI technology adds a layer of interactivity that goes beyond traditional gaming interfaces." />
      <Feature title="Neurorehabilitation Advancements" text="Witness the transformative impact of BCI on neurorehabilitation, aiding individuals in recovering motor functions and redefining possibilities after injury or stroke." />
     
      {/* <Feature title='Learning React' text='This is fully frontend prject based on react framework, objective of this project is to frame is webpage with help figma desing' /> */}
      </div>
      
    </div>
  )
}

export default WhatGPT
