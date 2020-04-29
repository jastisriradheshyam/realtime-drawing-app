import React, { useState, useEffect } from 'react';
import { subscribeToConnectionEvent } from './api.js';

const Connection = function () {
    const [conn, setConn] = useState({
        connState: 'connecting'
    });
    useEffect(() => {
        subscribeToConnectionEvent(({
            state: connState,
            port
        }) => {
            setConn({
                connState,
                port
            });
        })
    }, []);

    let content = null;
    if (conn.connState === "disconnected") {
        content = (
            <div className="Connection-error">
                We've lost connection to our server...
            </div>
        )
    }
    if (conn.connState === "connecting") {
        content = (
            <div>
                Connecting...
            </div>
        );
    }

    return (
        <div className="Connection">
            <div className="Connection-port">
                Socket port: {conn.port}
            </div>
            {content}
        </div>
    );
};

export default Connection; 