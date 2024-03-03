import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navbar } from './components';
import { Header, WhatGPT } from './containers';
import MiniGames from "./pages/minigame/Minigame";
import Demo from "./pages/demonstration/demo";
import Maker from "./pages/Makers/maker";
import Sentient  from "./pages/SentientAnalysis/Sentient";
import './App.css';
import ImageComponent from "./pages/FacialExpression/Face";
const App = () => {
  return(
    <div className="App">
       <div className="gradient__bg">
        <Navbar/>
        {/* <Header/> */}
        {/* <WhatGPT /> */}
       </div>
       <BrowserRouter>
       
       <Routes>
        <Route path="/" element = {<Header/>}/>
        <Route path="/home" element = {<Header/>} />
        <Route path="/prosthetic" element = {<WhatGPT/>} />
        <Route path="/Games" element={<MiniGames/>}/> 
        <Route path="/ImageComponent" element={<ImageComponent/>}/>
        <Route path="/maker" element={<Maker/>}/>
        <Route path="/Sentient" element={<Sentient/>}/>
        
       </Routes>
     
        </BrowserRouter>
    </div>
    

  )
}


export default App;
