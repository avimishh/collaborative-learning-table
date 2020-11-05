const express = require('express');
const socketio = require('socket.io');
const {
    Player
} = require('./models/player');
const {
    Game
} = require('./models/game');

var io;

var playerHost = null,
    playerGuest = null;
var gameToPlay = null;

var statusHost = 'disconnect';
var statusGuest = 'disconnect';

function init(io_startup) {
    io = io_startup;
    // io.eio.pingTimeout = 100;
    // io.eio.pingInterval = 10;
    io.on('connection', (socket) => {
        console.log('player connected, child id: ' + socket.handshake.query.child_ID);

        if (playerHost != null && playerGuest != null) {
            console.log(`There already two connections: ${playerHost.id} ${playerHost.name}, and ${playerGuest.id} ${playerGuest.name}.`);
            console.log('A new player trying connect to server, he throwed out');
            socket.emit('fromServer_toClient_welcome_msg', 'יש כבר שני מתמודדים, ההתחברות נכשלה.');
            socket.disconnect();
        }

        if (playerHost != null) {
            // playerHost is connected, now after guest player connected,
            // 2 players are connected
            init_Guest_player(socket);
            io.emit('fromServer_toClient_players_ready_hostPlayer_choose_game');
        } else {
            // playerHost making his connection, Only 1 player connected
            init_Host_player(socket);
        }

        // // Echo init_msg to all clients
        // socket.on('fromServer_toClient_welcome_msg', (text) => {
        //     echo_Message_To_All_Clients('fromServer_toClient_welcome_msg', text);
        // });

        socket.on('fromClient_toServer_client_asks_players_conn_status', () => {
            set_Connection_Status_To_Clients();
        });
    });
}

// function echo_Message_To_All_Clients(type, text){
//     io.emit(type, text);
// }

function set_Connection_Status_To_Clients() {
    statusHost = (playerHost === null) ? 'disconnect' : 'connect';
    statusGuest = (playerGuest === null) ? 'disconnect' : 'connect';
    io.emit('fromServer_toClient_players_conn_status', statusHost, statusGuest);
}

function init_Host_player(socket) {
    // get queries from socket connection
    playerHost = new Player(socket, socket.handshake.query.child_ID, socket.handshake.query.child_Name);
    playerHost.send_Welcome_Message_To_Client(`שלום ${playerHost.name}! אתה השחקן המארח, מחכים לאורח`);
    playerHost.set_Player_Role_To_Client('Host');

    playerHost.socket.on('disconnect', (text) => {
        console.log(`player ${playerHost.id} ${playerHost.name} disconnected`);
        playerHost = null;
        set_Connection_Status_To_Clients();
    });

    socket.on('fromHostClient_toServer_gameToPlay_details', (title, id, url) => {
        gameToPlay = new Game(title, id, url);
        io.emit('fromServer_toClients_openGameUrl', gameToPlay.url);
    });
    socket.on('fromClient_toServer_startGame', startGame);
}

function init_Guest_player(socket) {
    // get queries from socket connection
    playerGuest = new Player(socket, socket.handshake.query.child_ID, socket.handshake.query.child_Name);
    playerGuest.send_Welcome_Message_To_Client(`שלום ${playerGuest.name}! אתה השחקן השני, אפשר להתחיל`);
    playerGuest.set_Player_Role_To_Client('guest');

    playerGuest.socket.on('disconnect', (text) => {
        console.log(`player ${playerGuest.id} ${playerGuest.name} disconnected`);
        playerGuest = null;
        set_Connection_Status_To_Clients();
    });
}


const MathGame = require('./Math/MathQuests_Server');
const EnglishGame = require('./English/EnglishCards_Server');
const ColorsGame = require('./Colors/ColorSquares_Server');
// const MemoryGame = require('./Memory/MemoryCards_Server');

var playingGame;

// game code as parameter
async function startGame() {
    delete playingGame;
    if (playerHost === null || playerGuest === null) {
        console.log('There arent 2 players connected');
        return;
    }
    await sleep(500);
    // Start a game
    switch (gameToPlay.title) {
        case 'תרגילי חשבון':
            playingGame = new MathGame(playerHost, playerGuest, gameToPlay);
            break;
        case 'התאמת תמונות למילים':
            playingGame = new EnglishGame(playerHost, playerGuest, gameToPlay);
            break;
        case 'ריבועי צבעים':
            playingGame = new ColorsGame(playerHost, playerGuest, gameToPlay);
            break;
            // case 'כרטיסיות זכרון':
            //     playingGame = new MemoryGame(playerHost, playerGuest, gameToPlay);
            //     break;
        default:
            console.log('wrong game reference');
            break;
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports.init = init;