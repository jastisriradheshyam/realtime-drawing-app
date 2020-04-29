"use strict";
const fs = require('fs');
const path = require('path');
const logger = console;
const rawConfig = {};
const config = {};

/**
 * some checks are omitted
 */

try {
    const data = fs.readFileSync(path.resolve('./config.json'),
        { encoding: 'utf8' });
    Object.assign(rawConfig, JSON.parse(data))
} catch (error) {
    logger.error(error);
};

// ========== Server [ start ]  ==========
config.server = {};
const httpServerConfig = {};
const serverDefaultHost = "localhost";
const serverDefaultPort = 8000
httpServerConfig.host = process.env.HTTP_HOST ||
    rawConfig.server.http.host || serverDefaultHost;
httpServerConfig.port = process.env.HTTP_PORT ||
    rawConfig.server.http.port || serverDefaultPort;
config.server = httpServerConfig;
// ========== Server [ end ]  ==========

// ========== DB [ start ]  ==========
config.db = {};
const dbConfig = {};
dbConfig.host = process.env.DB_HOST ||
    rawConfig.db.host;
dbConfig.port = process.env.DB_PORT ||
    rawConfig.db.port;
dbConfig.dbName = process.env.DB_DB_NAME ||
    rawConfig.db.dbName;
config.db = dbConfig;
// ========== DB [ end ]  ==========
console.log(config)
module.exports = config;
