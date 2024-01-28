import React from 'react'
import './brand.css'
import { brand1, brand2, brand3, brand4 } from './index'

const Brand = () => {
  return (
    <div className='branding'>
     <div><img src={brand1} alt="brand1" /></div>
     <div> <img src={brand2} alt="brand2" /></div>
     <div><img src={brand3} alt="brand3" /></div>
     <div><img src={brand4} alt="brand4" /></div>
    </div>
  )
}

export default Brand
