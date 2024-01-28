import React from 'react'
import './feature.css'


const Feature = ({title,text}) => {
  return (
    <div className='gpt_container'>
      <div className='title'>
        <div/>
        <h1>{title}</h1>
      </div>
       <div className='content'>
        <p>{text}</p>
       
       </div>
    </div>
  )
}

export default Feature
