import React from 'react';
import './Sentient.css'; 

class HorizontalBar extends React.Component {
  render() {
    const { label, value, maxValue, color, emoji } = this.props;
    const barWidth = (value / maxValue) * 100 + "%";
    
    return (
      <div className="horizontal-bar">
        <span className="label">{label}</span>
        <div className="bar" style={{ width: barWidth, backgroundColor: color }}></div>
        <span className="emoji">{emoji}</span>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1> Sentiment Analysis: Understanding Emotions </h1> <br />
        {/* <h3>Exploring the depth of human emotions through sentiment analysis offers valuable insights into Prosthetics behavior and social responses. Dive deep into the subtleties of feeling.</h3> */}
         <div>
        <HorizontalBar label="Happy" value={70} maxValue={100} color="orange" emoji="😊" />
        <HorizontalBar label="Excitement" value={50} maxValue={100} color=" blue" emoji="😃" />
        <HorizontalBar label="Sad" value={20} maxValue={100} color="red" emoji="😢" />
        <HorizontalBar label="Stress" value={80} maxValue={100} color="pink" emoji="😫" />
        <HorizontalBar label="Focus" value={60} maxValue={100} color="green" emoji="😠" />
        </div>
      </div>
    );
  }
}

export default App;





