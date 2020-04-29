import React, { useEffect, useRef, useState } from 'react';
import Canvas from 'simple-react-canvas';
import { publishLine, subscribeToDrawingLines } from './api.js';

const Drawing = function (props) {
    const [lines, setLines] = useState([]);
    const linesRef = useRef(lines);
    useEffect(() => {
        linesRef.current = lines;
    })
    useEffect(() => {
        subscribeToDrawingLines(props.drawing.id, (linesEvent) => {
            setLines([...linesRef.current, ...linesEvent.lines]);
        });
    }, [props.drawing]);

    const handleDraw = line => {
        publishLine({
            drawingId: props.drawing.id,
            line
        });
    };
    return (props.drawing) ? (
        <div className="Drawing">
            <div className="Drawing-title">
                {props.drawing.name}
                ({lines.length})
            </div>
            <Canvas
                drawingEnabled={true}
                onDraw={handleDraw}
                lines={lines}
            />
        </div>
    ) : null;
};

export default Drawing;