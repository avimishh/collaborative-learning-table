const express = require('express');
const socketio = require('socket.io');


var players = [{ sock: null,
                 stats: null },
                { sock: null,
                 stats: null }];
var isPlayersReady = false;
var isStatsReady = 0;
var gameTitle = '';
var status0 = 'disconnect';
var status1 = 'disconnect';


function init(io) {
    // io.eio.pingTimeout = 100;
    // io.eio.pingInterval = 10;
    io.on('connection', (sock) => {
        console.log('player connected');
        console.log(sock.handshake.query.child_id);

        if (players[0].sock && players[1].sock) {
            console.log('player throwed out');
            sock.emit('init_msg', 'יש כבר שני מתמודדים');
            sock.disconnect();
        }

        if (players[0].sock) {
            // 2 players connected
            init_Guest_player(io, sock);
            io.emit('players_ready_choose_game');
        } else {
            // Only 1 player connected
            init_Host_player(io, sock);
        }

        // Echo init_msg to all clients
        sock.on('init_msg', (text) => {
            io.emit('init_msg', text);
        });

        sock.on('init_msg', (text) => {
            io.emit('init_msg', text);
        });

        sock.on('conn_status', () => {
            status0 = (players[0].sock === null) ? 'disconnect' : 'connect';
            status1 = (players[1].sock === null) ? 'disconnect' : 'connect';
            io.emit('toClient_conn_status', status0, status1);
        });

        // sock.on('disconnect', (text) => {
        //     console.log('player disconnected');
        //     // io.emit('init_msg', text);
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


function init_Host_player(io, sock) {
    players[0].sock = sock;
    players[0].sock.emit('init_msg', 'שלום מארח');
    players[0].sock.emit('init_msg', 'אתה השחקן הראשון, מחכים לאורח');
    sock.emit('set_player_role', 'Host');
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
    sock.on('start_game', (title) => {
        gameTitle = title;
        // startGame();
    });
    sock.on('request_game_url_replace', (game_url, game_id) => {
        io.emit('open_game_page', game_url, game_id);
    });
}


function init_Guest_player(io, sock) {
    players[1].sock = sock;
    players[1].sock.emit('init_msg', 'שלום אורח');
    players[1].sock.emit('init_msg', 'אתה השחקן השני, אפשר להתחיל');
    sock.emit('set_player_role', 'guest');
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
        startGame();
    });
}

const MathGame = require('./Math/math_game');
const EnglishGame = require('./English/english_game');

// game code as parameter
function startGame() {
    // console.log('start');
    if (isPlayersReady === false && isStatsReady < 2) {
        console.log('There isnt 2 players connected');
        return;
    }
    // Start a game
    if (gameTitle === 'Math') {
        new MathGame(players[0], players[1]);
    }
    if (gameTitle === 'English') {
        new EnglishGame(players[0], players[1]);
    }
}


module.exports.init = init;
// module.exports.startGame = startGame;
// module.exports.setGameToPlay = setGameToPlay;
// module.exports.setPlayerStatsObject = setPlayerObject;