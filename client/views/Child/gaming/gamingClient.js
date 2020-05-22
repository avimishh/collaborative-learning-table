const server = "http://localhost:3000/api/";
const serverStatic = "http://localhost:3000/static/"
const gamesApi = server + "games/";
const childsApi = server + "childs/";
const playGamesApi = server + "playGames/";


function childLogin(childId, successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: childsApi + childId,
        method: "GET",
        // data: JSON.stringify({
        //     id: child.id,
        //     gamesPassword: child.password
        // }),
        success: function (data, textStatus, xhr) {
            // data._id = '5ea98c3556adcc84503d58ca';
            console.log('child_id: ' + data._id);
            localStorage.setItem('child_id', data._id);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


// function getGames(successFunction, errorFunction, completeFunction) {
//     let request = {
//         contentType: "application/json",
//         url: gamesApi,
//         method: "GET",
//         // headers: { 'x-auth-token' : localStorage.getItem('token') },
//         // data: JSON.stringify(parent),
//         success: function (data, textStatus, xhr) {
//             successFunction(data);//, textStatus, jqXHR);
//             showGames(data);
//         },
//         error: function (xhr) {
//             errorFunction(xhr.status, xhr.responseText);
//         }
//     };

//     // if (completeFunction !== undefined) request.complete = completeFunction;

//     $.ajax(request);
// }


// function startGame(gameId, successFunction, errorFunction, completeFunction) {
//     let request = {
//         contentType: "application/json",
//         url: playGamesApi + "start/",
//         method: "POST",
//         // headers: { 'x-auth-token' : localStorage.getItem('token') },
//         data: JSON.stringify({
//             child_id: localStorage.getItem('child_id'),
//             game_id: localStorage.getItem('game_id')
//         }),
//         success: function (data, textStatus, xhr) {
//             // console.log(data);
//             localStorage.setItem('statsObject_id', data._id);
//             console.log('statsObject_id: ' + data._id);
//         },
//         error: function (xhr) {
//             errorFunction(xhr.status, xhr.responseText);
//         }
//     };

//     $.ajax(request);
// }

$(document).ready(() => {
    init();
});

var sock = null;

function init() {
    $('#getGames').on('click', () => {
        $('#gameFrame').attr('src', './gamesGallery/gamesGallery.html');
    });
    $('#childLogin').on('click', () => {
        let childId = $('#childId').val();
        console.log(childId);
        childLogin(childId, showResponse, showError);
    });
    $('#socket_connect').on('click', () => {
        console.log('socket connected');
        sock = io();
    });
    $('#socket_disconnect').on('click', () => {
        console.log('socket disconnected');
        sock.disconnect(true);
    });
}


// function showGames(games) {
//     games.forEach(game => {
//         let $btn = $('<button>').text(game.title).on('click', () => {
//             localStorage.setItem('game_id', game._id);
//             startGame(game._id);
//             //serverStatic
//             $('#gameFrame').attr('src', game.link);
//         });
//         let $img = $('<img>').attr('src', game.icon).css({'width':'30px', 'height':'30px'});
//         $('#gallery').append($btn);
//         $('#gallery').append($img)
//     });
// }


function showResponse(data) {
    console.log(data);
    $('#response').text(JSON.stringify(data, null, 2));
}


function showError(status, responseText) {
    $('#error').text(`ERROR: ${status}, ${responseText}`);
}