import React, { useState } from 'react';
import { createDrawing } from './api.js';

function DrawingForm() {
    const [drawingName, setDrawingName] = useState('');
    const handleSubmit = evt => {
        evt.preventDefault();
        createDrawing(drawingName);
        setDrawingName('');
    };
    return (
        <div className="Form">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={drawingName}
                    onChange={(evt) => {
                    setDrawingName(evt.target.value);
                }}
                    placeholder="Drawing name"
                    className="Form-drawing-input"
                    required
                />
                <button
                    type="submit"
                    className="Form-drawingInput"
                >Create</button>
            </form>
        </div>
    )
};

export default DrawingForm;