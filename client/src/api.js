import openSocket from 'socket.io-client';
import { fromEventPattern } from 'rxjs';
import { bufferTime, withLatestFrom } from 'rxjs/operators';
import { map } from 'rxjs/operators/map';
import { scan } from 'rxjs/operators/scan';
import createSync from 'rxsync';

import config from './config.json';
let port = parseInt(window.location.search.replace('?', ''), 10) || config.socketPort;

const socket = openSocket(`http://${config.socketHost}:${port}`);

const subscribeToDrawing = function (cb) {
    socket.on('drawing', timestamp => cb(timestamp));
    socket.emit('subscribeToDrawing');
};

const createDrawing = function (name) {
    socket.emit('createDrawing', { name });
};

const sync = createSync({
    maxRetries: 10,
    delayBetweenRetries: 1000,
    syncAction: line => new Promise((resolve, reject) => {
        let sent = false;
        socket.emit('publishLine', line, () => {
            sent = true;
            resolve();
        });

        setTimeout(() => {
            if (!sent) {
                reject();
            }
        }, 2000);
    })
});

sync.failedItems.subscribe(x => console.error('failed line sync', x));
sync.syncedItems.subscribe(x => console.log('line synced', x));

const publishLine = function ({ drawingId, line }) {
    sync.queue({ drawingId, ...line });
};

const subscribeToDrawingLines = function (drawingId, cb) {
    // setting up rx took lot of time due to version 6 breaking changes 
    const lineStream = fromEventPattern(
        h => socket.on(`drawingLine:${drawingId}`, h),
        h => socket.off(`drawingLine:${drawingId}`, h),
    );

    const reconnectStream = fromEventPattern(
        h => socket.on('connect', h),
        h => socket.off('connect', h)
    );
    const maxStream = lineStream
        .pipe(map(l => new Date(l.timestamp).getTime()))
        .pipe(scan((a, b) => Math.max(a, b), 0));

    reconnectStream.pipe(
        withLatestFrom(maxStream)
    )
        .subscribe(joined => {
            const lastReceivedTimestamp = joined[1];
            socket.emit('subscribeToDrawingLines', {
                drawingId,
                from: lastReceivedTimestamp
            });
        })


    const bufferedTimeStreamRaw = lineStream.pipe(bufferTime(100))
    const bufferedTimeStream = bufferedTimeStreamRaw.pipe(map(lines => ({ lines })));
    bufferedTimeStream.subscribe(linesEvent => cb(linesEvent));
    socket.emit('subscribeToDrawingLines', { drawingId });
};

const subscribeToConnectionEvent = function (cb) {
    socket.on('connect', () => cb({
        state: 'connected',
        port
    }));
    socket.on('disconnect', () => cb({
        state: 'disconnected',
        port
    }));
    socket.on('connect_error', () => cb({
        state: 'disconnected',
        port
    }));
}

export {
    subscribeToDrawing,
    createDrawing,
    publishLine,
    subscribeToDrawingLines,
    subscribeToConnectionEvent
};