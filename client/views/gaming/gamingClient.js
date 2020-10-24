$(document).ready(() => {
    init();
    $('#socket_connect').trigger('click');
});

var sock = null;
var isHost = false;

function init() {
    $('#btn_goToHome').on('click', () => {
        if (sock) $('#socket_disconnect').trigger('click');
        window.location.href = '../HomeScreen.html';
    });

    $('#socket_connect').on('click', () => {
        console.log('socket connected');
        connectToSocket();
    });
    $('#socket_disconnect').on('click', () => {
        player_status_update('', '');
        console.log('socket disconnected');
        sock.disconnect(true);
    });
}


function connectToSocket() {
    // sock = io();
    let child = JSON.parse(localStorage.getItem('child'));
    sock = io.connect('', {
        query: `child_ID=${child.id}&child_Name=${child.firstName}`
    });

    sock.emit('fromClient_toServer_client_asks_players_conn_status');
    sock.on('fromServer_toClient_players_conn_status', (status0, status1) => {
        player_status_update(status0, status1);
    });

    sock.on('fromServer_toClient_set_player_role', (role) => {
        if (role === 'Host') {
            console.log('host');
            isHost = true;
            $('#host_player').addClass('thicker');
        } else {
            console.log('guest');
            $('#guest_player').addClass('thicker');
        }
    });
    sock.on('fromServer_toClient_players_ready_hostPlayer_choose_game', () => {
        openGamesGalleryFrame();
    });
    sock.on('fromServer_toClient_welcome_msg', (text) => {
        showModalMessage(text);
    });
}


function openGamesGalleryFrame() {
    $('#frame-iframe').attr('src', 'gamesGallery.html');
}


function player_status_update(status0, status1) {
    let $host_div = $('#host_player');
    let $guest_div = $('#guest_player');
    $host_div.text('').removeClass('p_con').removeClass('p_ncon');
    $guest_div.text('').removeClass('p_con').removeClass('p_ncon');
    if (status0 === 'disconnect')
        $host_div.text(`שחקן מארח: לא מחובר`).addClass('p_ncon');
    else if (status0 === 'connect')
        $host_div.text(`שחקן מארח: מחובר`).addClass('p_con');
    if (status1 === 'disconnect')
        $guest_div.text(`שחקן אורח: לא מחובר`).addClass('p_ncon');
    else if (status1 === 'connect')
        $guest_div.text(`שחקן אורח: מחובר`).addClass('p_con');
}


function showModalMessage(text) {
    $('#modal-instruction-text').text(text);

    $("#modal-instruction").fadeIn("slow");
    setTimeout(() => {
        $("#modal-instruction").fadeOut("slow");
    }, 5000);
}

function hideModal() {
    $('#modal-instruction').hide();
}