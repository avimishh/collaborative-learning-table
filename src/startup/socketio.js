const express = require('express');
const socketio = require('socket.io');
// const { init } = require('./../public/games/gameStarter').init(io);

module.exports = function (server) {
    const io = socketio(server);
    console.log('io is on');
    require('./../public/games/gameStarter').init(io);
    // require('./../public/server_math/server')(io);
}