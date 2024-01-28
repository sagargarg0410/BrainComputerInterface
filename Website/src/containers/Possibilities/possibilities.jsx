import React from 'react'
import './possibilities.css'
import  possibility1 from '../../assets/possibility1.png'

const Possibilities = () => {
  return (
    <div className='gpt3__possibility'>
      <div className='gpt3__possibility-image' id='possibilities'>
      <img src={possibility1} alt="possibility" width={85}/>
    </div>


    <div className="gpt3__possibility-content">
      <h4>Request Early Access to Get Started</h4>
      <h1 className="gradient__text">The possibilities are <br /> beyond your imagination</h1>
      <p>Yet bed any for travelling assistance indulgence unpleasing. Not thoughts all exercise blessing. Indulgence way everything joy alteration boisterous the attachment. Party we years to order allow asked of.</p>
      <h4>Request Early Access to Get Started</h4>
    </div>
    </div>
  )
}

export default Possibilities
