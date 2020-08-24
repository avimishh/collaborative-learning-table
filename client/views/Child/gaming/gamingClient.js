$(document).ready(() => {
    init();
});

var sock = null;
var isHost = false;

function init() {
    $('#btn_goToHome').on('click', () => {
        if(sock) $('#socket_disconnect').trigger('click');
        window.location.href = '../HomeScreen.html';
    });

    $('#getGames').on('click', () => {
        $('#gameFrame').attr('src', 'gamesGallery.html');
    });
    $('#childLogin').on('click', () => {
        let childId = $('#childId').val();
        console.log(childId);
        childLogin(childId, showResponse, showError);
    });
    $('#socket_connect').on('click', () => {
        console.log('socket connected');
        // sock = io();
        let child = JSON.parse(localStorage.getItem('child'));
        // console.log(child);
        // sock = io.connect('', {query: `child_ID=${child.id}`});
        sock = io.connect('', {query: `child_ID=${child.id}&child_Name=${child.firstName}`});
        sock.emit('conn_status');
        sock.on('toClient_conn_status', (status0, status1) => {
            player_status_update(status0, status1);
        });
        sock.on('set_player_role', (role) => {
            if (role === 'Host') {
                console.log('host');
                isHost = true;
                $('#host_player').addClass('thicker');
                // setHostEvents();
            }
            else{
                console.log('guest');
                $('#guest_player').addClass('thicker');
            }
        });
        sock.on('players_ready_choose_game', () => {
            getGames();
            // if(isHost) getGames();
            // else waitForHost();
        });
        sock.on('init_msg', (text) => {
            messageEvent(text)
        });
    });
    $('#socket_disconnect').on('click', () => {
        player_status_update('','');
        console.log('socket disconnected');
        sock.disconnect(true);
    });
}





// function setHostEvents(){
//     sock.on('players_ready_choose_game', () => {
//         if(isHost) getGames();
//         else waitForHost();
//     });
// }


function getGames(){
    $('#gameFrame').attr('src', 'gamesGallery.html');
}


function waitForHost(){
    // $('#gameFrame').attr('src');
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


// print messages to player from server
var msg_counter = 0;
const messageEvent = (text) => {
    let $new_li = $("<li>").text(`${msg_counter}: ${text}`);
    $('#events').prepend($new_li);
    msg_counter++;
};

