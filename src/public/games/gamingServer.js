const express = require('express');
const socketio = require('socket.io');
const {Player} = require('./models/player');
const {Game} = require('./models/game');

var io;

var playerHost = null, playerGuest = null;
var gamePlayed = null;

var status0 = 'disconnect';
var status1 = 'disconnect';

function init(io_startup) {
    io = io_startup;
    // io.eio.pingTimeout = 100;
    // io.eio.pingInterval = 10;
    io.on('connection', (socket) => {
        console.log('player connected, child id: ' + socket.handshake.query.child_ID);

        if (playerHost != null && playerGuest != null) {
            console.log(`There already two connections: ${playerHost.id} ${playerHost.name}, and ${playerGuest.id} ${playerGuest.name}.`);
            console.log('A new player trying connect to server, he throwed out');
            socket.emit('init_msg', 'יש כבר שני מתמודדים, ההתחברות נכשלה.');
            socket.disconnect();
        }

        if (playerHost != null) {
            // playerHost is connected, now after guest player connected,
            // 2 players are connected
            init_Guest_player(socket);
            io.emit('players_ready_choose_game');
        } else {
            // playerHost making his connection, Only 1 player connected
            init_Host_player(socket);
        }

        // Echo init_msg to all clients
        socket.on('init_msg', (text) => {
            echo_Message_To_All_Clients('init_msg', text);
        });

        socket.on('conn_status', () => {
            set_Connection_Status_To_Clients();
        });
    });
}

function echo_Message_To_All_Clients(type, text){
    io.emit(type, text);
}

function set_Connection_Status_To_Clients(){
    status0 = (playerHost === null) ? 'disconnect' : 'connect';
    status1 = (playerGuest === null) ? 'disconnect' : 'connect';
    io.emit('toClient_conn_status', status0, status1);
}

function init_Host_player(socket) {
    // get queries from socket connection
    let id = socket.handshake.query.child_ID;
    let name = socket.handshake.query.child_Name;
    // init guest client
    playerHost = new Player(socket, id, name);
    playerHost.send_Init_Message_To_Client(`שלום ${name}! אתה השחקן המארח, מחכים לאורח`);
    playerHost.set_Player_Role_To_Client('Host');

    playerHost.socket.on('disconnect', (text) => {
        console.log(`player ${playerHost.id} ${playerHost.name} disconnected`);
        playerHost = null;
        set_Connection_Status_To_Clients();
    });

    socket.on('start_game', (title) => {
        startGame();
    });
    socket.on('init_game', (title, id, url) => {
        gamePlayed = new Game(title, id, url);
        io.emit('open_game_page', gamePlayed.url);
    });
}

function init_Guest_player(socket) {
    // get queries from socket connection
    let id = socket.handshake.query.child_ID;
    let name = socket.handshake.query.child_Name;
    // init guest client
    playerGuest = new Player(socket, id, name);
    playerGuest.send_Init_Message_To_Client(`שלום ${name}! אתה השחקן השני, אפשר להתחיל`);
    playerGuest.set_Player_Role_To_Client('guest');

    playerGuest.socket.on('disconnect', (text) => {
        console.log(`player ${playerGuest.id} ${playerGuest.name} disconnected`);
        playerGuest = null;
        set_Connection_Status_To_Clients();
    });
}


const MathGame = require('./Math/math_game');
const EnglishGame = require('./English/english_game');

var playingGame;

// game code as parameter
function startGame() {
    delete playingGame;
    if (playerHost === null || playerGuest === null) {
        console.log('There arent 2 players connected');
        return;
    }
    // Start a game
    switch (gamePlayed.title) {
        case 'תרגילי חשבון':
            playingGame = new MathGame(playerHost, playerGuest, gamePlayed);
            break;
        case 'התאמת תמונות למילים':
            playingGame = new EnglishGame(playerHost, playerGuest, gamePlayed);
            break;
        default:
            console.log('wrong game reference');
            break;
    }
}


module.exports.init = init;