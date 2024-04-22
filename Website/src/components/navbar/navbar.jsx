import React from 'react';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
// import { Link } from 'react-router-dom';
import './navbar.css'
import { useState } from 'react';

const Menu = () => {
  return (
    <>

      <p><a href="/home">Home</a></p>
      <p><a href="/prosthetic">BCI</a></p>
      {/* <p><a href="/demo">Demonstration</a></p>   */}
      <p><a href="/Games">Mini Games</a></p>
      {/* <li><link to={"#Games"}>Mini Games</link></li> */}
      {/* <p><a href="#blog">Library</a></p> */}
      <p><a href="/Sentient"> Sentient Analysis</a></p>
      <p><a href="/ImageComponent">Facial Expressions</a></p>
      <p><a href="/Maker">Founders</a></p>
    </>)
}
const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <div className='gpt__navbar'>
      <div className='gpt__navbar-links'>
        <div className='gpt__navbar-links_logo'>
          {/* <img src={logo} alt="logo" /> */}
        </div>
        <div className='gpt__navbar-links_container'><Menu />
        </div>
      </div>
      <div className='gpt__navbar-sign'>
        {/* <p>Sign in</p> */}
        {/* <button type='button'>Sign Up</button> */}
      </div>
      <div className='gpt__navbar-menu'>
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
          <div className="gpt__navbar-menu_container scale-up-center">
            {/* <div className="gpt__navbar-menu_container-links">
            <p><a href="#home">Home</a></p>
            <p><a href="#whatgpt">What is GPT3??</a></p>
            <p><a href="#possibilities">Open AI</a></p>
            <p><a href="#feature">Case Studies</a></p>
            <p><a href="#blog">Library</a></p>
            <Menu/>
          </div> */}
            <div className="gpt__navbar-menu_container-links-sign">
              <p>Sign in</p>
              <button type="button">Sign up</button>
            </div>
          </div>
        )}
      </div>


    </div>
  )
}

export default Navbar
