import React from "react";
import './maker.css';
import Sagar from '../../assets/Sagar.jpeg'
import joyeeta from '../../assets/joyeeta.jpeg'
import anshu from '../../assets/anshu.jpeg'
import jatin from '../../assets/jatin.jpg'

const Maker=()=>{
    return(
        <div className="container">
            <div className="card">
                <div className="imgbox">
                   <img src={Sagar} alt="s"></img>
                   <br></br>
                   <h1 className="gradient__text">Sagar Garg</h1>
                </div>
                <div className="content">
                    <p>Sagar Garg is currently pursuing
his bachelor’s degree in ECE
from BVCOE, GGSIPU, New
Delhi. He has deep fascination for
Embedded Systems. He has worked
on many automation projects that
includes portable small form factor
function generator, music mapped
LEDS to name a few.</p>
                </div>
            </div>
            <div className="card">
                <div className="imgbox">
                   <img src={joyeeta} alt="s"></img>
                   <br></br>
                   <h1 className="gradient__text">Joyeeta C.</h1>
                </div>
                <div className="content">
                    <p>Joyeeta Choubey is currently pursuing
her bachelor’s degree in ECE
from BVCOE, GGSIPU, New
Delhi. She is enthusiastic and motivated learner proficient in front-end technologies.  Dedicated to stay up to date with industry trends and emerging technologies .</p>
                </div>
            </div>
            <div className="card">
                <div className="imgbox">
                   <img src={anshu} alt="s"></img>
                   <br></br>
                   <h1 className="gradient__text">Anshu Raj</h1>
                </div>
                <div className="content"> 
                    <p>Anshu is working as a traniee in Newgen and currently pursuing
his bachelor’s degree in ECE
from BVCOE, GGSIPU, New
Delhi. He is enthusiastic and motivated learner proficient in MERN Stacks. Dedicated to stay up to date with industry trends and emerging technologies.</p>
                </div>
            </div>
            <div className="card">
                <div className="imgbox">
                   <img src={jatin} alt="s"></img>
                   <br></br>
                   <h1 className="gradient__text">Jatin Kaushik</h1>
                </div>
                <div className="content"> 
                    <p>Jatin is currently pursuing
her bachelor’s degree in ECE
from BVCOE, GGSIPU, New
Delhi. He is a highly motivated and
confident Undergraduate with a
strong passion for problem solving. He has hands-on experience on IOT with various microcontroller boards.
</p>
                </div>
            </div>
        </div>
    )
}
export default Maker;