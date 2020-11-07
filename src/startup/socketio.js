const express = require('express');
const socketio = require('socket.io');
const logger = require('./logging');
// const { init } = require('./../public/games/gameStarter').init(io);


module.exports = function (server, app) {
    const io = socketio(server);
    logger.info('SocketIO - On');
    require('./../public/games/gamingServer').init(io);
    // require('./../public/server_math/server')(io);
}