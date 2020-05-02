const express = require('express');
const socketio = require('socket.io');

var players = [null, null];
var isPlayersReady = false;


function init(io) {
    io.on('connection', (sock) => {
        if (players[0] && players[1]) {
            sock.emit('message', 'יש כבר שני מתמודדים');
            sock.disconnect();
        }

        if (players[0]) {
            players[1] = sock;
            players[1].emit('message', 'אתה השחקן השני, אפשר להתחיל');
            // 2 players connected
            isPlayersReady = true;
        } else {
            // Only 1 player connected
            players[0] = sock;
            players[0].emit('message', 'אתה השחקן הראשון, מחכים למתמודד');
        }

        // Echo message to all clients
        sock.on('message', (text) => {
            io.emit('message', text);
        });
    });
}


const MathGame = require('./../games/Math/math_game');

// game code as parameter
function startGame(gameTitle) {
    if(isPlayersReady === false){
        console.log('There isnt 2 players connected');
        return;
    }
    // Start a game
    if(gameTitle === 'Math')
        new MathGame(players[0], players[1]);
}


module.exports.init = init;
module.exports.startGame = startGame;