import React, { useState } from 'react';
import './App.css';
import DrawingForm from './DrawingForm.js';
import DrawingList from './DrawingList.js';
import Drawing from './Drawing.js';
import Connection from './connection.js';

function App() {
  const [drawing, setDrawing] = useState({});
  const selectDrawing = drawing => {
    setDrawing({
      selectedDrawing: drawing
    });
  }

  let ctrl = (
    <div>
      <DrawingForm />
      <DrawingList
        selectDrawing={selectDrawing}
      />
    </div>
  );
  if (drawing.selectedDrawing) {
    ctrl = (
      <Drawing
        drawing={drawing.selectedDrawing}
        key={drawing.selectedDrawing.id}
      />
    )
  }
  return (
    <div className="App">
      <div className="App-header">
        <h2>Our awesome drawing app</h2>
      </div>
      <Connection />
      {ctrl}
    </div>
  );
}

export default App;
