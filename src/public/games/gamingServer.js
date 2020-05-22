const express = require('express');
const socketio = require('socket.io');


var players = [{ sock: null, stats: null },
{ sock: null, stats: null }];
var isPlayersReady = false;
var isStatsReady = 0;
// var gameTitle = '';
var status0 = 'disconnect';
var status1 = 'disconnect';

function init(io) {
    io.on('connection', (sock) => {
        console.log('player connected');

        if (players[0].sock && players[1].sock) {
            console.log('player throwed out');
            sock.emit('message', 'יש כבר שני מתמודדים');
            sock.disconnect();
        }

        if (players[0].sock) {
            players[1].sock = sock;
            players[0].sock.emit('message', 'שלום אורח');
            players[1].sock.emit('message', 'אתה השחקן השני, אפשר להתחיל');
            sock.emit('set_player_role', 'guest');
            // sock.emit('conn_status');
            // 2 players connected
            isPlayersReady = true;
            sock.on('disconnect', (text) => {
                // io.emit('conn_status', 1, 'disconnect');
                console.log('player 1 disconnected');
                players[1].sock = null;
                isPlayersReady = false;
                status1 = 'disconnect';
                io.emit('toClient_conn_status', status0, status1);
            });
            sock.on('setStatsObject', (statsObject_id) => {
                players[1].stats = statsObject_id;
                isStatsReady++;
                // startGame();
            });
            io.emit('players_ready_choose_game');
        } else {
            // Only 1 player connected
            players[0].sock = sock;
            players[0].sock.emit('message', 'שלום מארח');
            players[0].sock.emit('message', 'אתה השחקן הראשון, מחכים לאורח');
            sock.emit('set_player_role', 'Host');
            // sock.emit('conn_status');
            sock.on('disconnect', (text) => {
                console.log('player 0 disconnected');
                players[0].sock = null;
                isPlayersReady = false;
                status0 = 'disconnect';
                io.emit('toClient_conn_status', status0, status1);
            });
            sock.on('setStatsObject', (statsObject_id) => {
                players[0].stats = statsObject_id;
                isStatsReady++;
            });
            sock.on('start_game', (gameTitle) => {
                console.log('game started');
                if (gameTitle === 'Math') {
                    new MathGame(players[0], players[1]);
                }
            });
            sock.on('request_game_url_replace', (game_url) =>{
                io.emit('open_game_page', game_url);
            });
        }

        // Echo message to all clients
        sock.on('message', (text) => {
            io.emit('message', text);
        });



        sock.on('conn_status', () => {
            status0 = (players[0].sock === null) ? 'disconnect' : 'connect';
            status1 = (players[1].sock === null) ? 'disconnect' : 'connect';
            io.emit('toClient_conn_status', status0, status1);
        });

        // sock.on('disconnect', (text) => {
        //     console.log('player disconnected');
        //     // io.emit('message', text);
        // });


        // sock.on('setStatsObject', (statsObject_id) => {
        //     if (players[0].sock === sock)
        //         players[0].stats = statsObject_id;
        //     else if (players[1].sock === sock)
        //         players[1].stats = statsObject_id;
        //     isStatsReady++;
        //     startGame();
        // });
    });
}

// function setGameToPlay(title) {
//     gameTitle = title;
// }


const MathGame = require('./Math/math_game');

// game code as parameter
// function startGame() {
//     // console.log('start');
//     if (isPlayersReady === false && isStatsReady < 2) {
//         console.log('There isnt 2 players connected');
//         return;
//     }
//     // Start a game
//     if (gameTitle === 'Math') {
//         new MathGame(players[0], players[1]);
//         // console.log('startGame');
//     }
// }


module.exports.init = init;
// module.exports.startGame = startGame;
// module.exports.setGameToPlay = setGameToPlay;
// module.exports.setPlayerStatsObject = setPlayerObject;