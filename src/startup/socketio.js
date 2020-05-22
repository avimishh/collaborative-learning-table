const express = require('express');
const socketio = require('socket.io');
// const { init } = require('./../public/games/gameStarter').init(io);


module.exports = function (server, app) {
    const io = socketio(server);
    // var session = require("express-session")({
    //     secret: "my-secret",
    //     resave: true,
    //     saveUninitialized: true
    //   });
    // var sharedsession = require("express-socket.io-session");
    // app.use(session);
    
    console.log('io is on');
    require('./../public/games/gamingServer').init(io);
    // require('./../public/server_math/server')(io);
}