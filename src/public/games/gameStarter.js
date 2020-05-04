const express = require('express');
const socketio = require('socket.io');


var players = [{ sock: null, stats: null }, { sock: null, stats: null }];
var isPlayersReady = false;
var isStatsReady = 0;
var gameTitle = '';
var stat_id = '';


function init(io) {
    io.on('connection', (sock) => {
        console.log('io connect');
        if (players[0].sock && players[1].sock) {
            sock.emit('message', 'יש כבר שני מתמודדים');
            sock.disconnect();
        }

        if (players[0].sock) {
            players[1].sock = sock;
            players[1].sock.emit('message', 'אתה השחקן השני, אפשר להתחיל');
            // 2 players connected
            isPlayersReady = true;
        } else {
            // Only 1 player connected
            players[0].sock = sock;
            players[0].sock.emit('message', 'אתה השחקן הראשון, מחכים למתמודד');
        }

        // Echo message to all clients
        sock.on('message', (text) => {
            io.emit('message', text);
        });

        sock.on('end', () => {
            sock.disconnect();
            console.log('disconnect');
        });

        sock.on('setStatsObject', (statsObject_id) => {
            if (players[0].sock === sock)
                players[0].stats = statsObject_id;
            else if (players[1].sock === sock)
                players[1].stats = statsObject_id;
            isStatsReady++;
            startGame();
        });
    });
}

function setGameToPlay(title) {
    gameTitle = title;
}

function setPlayerObject(statObj_id) {
    stat_id = statObj_id;
}

const MathGame = require('./../games/Math/math_game');

// game code as parameter
function startGame() {
    // console.log('start');
    if (isPlayersReady === false && isStatsReady < 2) {
        console.log('There isnt 2 players connected');
        return;
    }
    // Start a game
    if (gameTitle === 'Math')
        new MathGame(players[0], players[1]);
}


module.exports.init = init;
module.exports.startGame = startGame;
module.exports.setGameToPlay = setGameToPlay;
module.exports.setPlayerStatsObject = setPlayerObject;