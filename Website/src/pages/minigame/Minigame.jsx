import React from "react";
import pingpongimage from '../../assets/pingpongimage.jpg'
import './Minigame.css'
import FruitRally from '../../assets/FruitRally.jpeg'


const MiniGames =()=>{
    return(<div className="pingContainer">
        <div className="pingimg">
            <h1 className="gradient__text">Ping Pong Game</h1>
            <br></br>
        <img   src= {pingpongimage} alt="no img"/>
        </div>     
        </div>
    )
}
export default MiniGames;