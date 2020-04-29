"use strict";

const io = require('socket.io')();
const config = require('./config');
const serverConfig = config.server;
const dbConfig = config.db;
const logger = console;
const r = require('rethinkdb');

const createDrawing = function ({ rConn, name }) {
    r.table('drawings')
        .insert({
            name,
            timestamp: new Date()
        })
        .run(rConn)
        .then(() => {
            logger.log('created a drawing with name:', name);
        });
}

const subscribeToDrawing = function ({ client, rConn }) {
    r.table('drawings')
        .changes({ includeInitial: true })
        .run(rConn)
        .then(cursor => {
            cursor.each((err, drawingRow) => {
                client.emit('drawing', drawingRow.new_val);
            })
        });
};

const handleLinePublish = function ({ rConn, line, callback }) {
    // logger.log('saving line to the db');
    r.table('lines')
        .insert(Object.assign(line, { timestamp: new Date() }))
        .run(rConn)
        .then(callback);
};

const subscribeToDrawingLines = function ({ client, rConn, drawingId, from }) {
    let query = r.row('drawingId').eq(drawingId);
    if (from) {
        query = query.and(
            r.row('timestamp').gt(new Date(from))
        );
    }
    return r.table('lines')
        .filter(query)
        .changes({ includeInitial: true })
        .run(rConn)
        .then((cursor) => {
            cursor.each((err, lineRow) => {
                client.emit(`drawingLine:${drawingId}`, lineRow.new_val);
            })
        })
};

r.connect({
    host: dbConfig.host,
    port: dbConfig.port,
    db: dbConfig.dbName
}).then((rConn) => {
    io.on('connection', client => {
        client.on('createDrawing', ({ name }) => {
            createDrawing({
                rConn,
                name
            });
        });
        client.on('subscribeToDrawing', () => {
            subscribeToDrawing({
                client,
                rConn
            })
        });

        client.on('publishLine', (line, callback) => {
            handleLinePublish({
                line,
                rConn,
                callback
            });
        });

        client.on('subscribeToDrawingLines', ({ drawingId, from }) => {
            subscribeToDrawingLines({
                client,
                rConn,
                drawingId,
                from
            });
        });
    });
})



logger.info('listening on port', serverConfig.port);
io.listen(serverConfig.port);