import React, { useState } from 'react';
import './App.css';
import Header from '../src/components/header/Header';
import Feature from './components/feature/Feature';
import ReadText from './components/read-text/ReadText';
import SpeechToText from './components/speech-to-text/SpeechToText';

function App() {
  const [ firstFeature, setFirstFeture ] = useState(true);
  return (
    <div className="App">
      <div>
        <Header />
      </div>
      <div className="wrap-feature">
        <Feature type='Text To Speech' isClick={firstFeature} onClick={() => { setFirstFeture(true); }} />
        <Feature type='Speech To Text' isClick={!firstFeature} onClick={() => { setFirstFeture(false); }} />
      </div>
      {
      firstFeature ?
        <div>
            <ReadText/>
        </div>
        :
        <div>
          <SpeechToText/>
        </div>
      }
    </div>
  );
}

export default App;
