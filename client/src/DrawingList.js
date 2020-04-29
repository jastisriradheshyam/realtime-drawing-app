import React, { useState, useEffect, useRef } from 'react';
import { subscribeToDrawing } from './api.js';
function DrawingList(props) {
    const [drawingName, setDrawingName] = useState([]);
    const drawingNameRef = useRef(drawingName);
    useEffect(() => {
        drawingNameRef.current = drawingName;
    })
    useEffect(() => {
        subscribeToDrawing((name) => {
            setDrawingName([...drawingNameRef.current].concat(name));
        });
    }, []);
    const drawing = drawingName.map(drawing => (
        <li
            className="DrawingList-item"
            key={drawing.id}
            onClick={evt => props.selectDrawing(drawing)}
        >
            {drawing.name}
        </li>
    ));
    return (
        <ul
            className="DrawingList"
        >
            {drawing}
        </ul>
    );
};

export default DrawingList;