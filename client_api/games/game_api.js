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
            localStorage.setItem('child_id', data._id);
            // console.log(localStorage.getItem('token'));
            // sessionStorage.setItem(tokenStorageKeyString, data.token);
            // successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


function getGames(successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: gamesApi,
        method: "GET",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        // data: JSON.stringify(parent),
        success: function (data, textStatus, xhr) {
            successFunction(data);//, textStatus, jqXHR);
            showGames(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };

    // if (completeFunction !== undefined) request.complete = completeFunction;

    $.ajax(request);
}


function startGame(gameId, successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: playGamesApi + "start/",
        method: "POST",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify({
            child_id: '5ea97717caf7119aece7c00b',
            game_id: gameId
        }),
        success: function (data, textStatus, xhr) {
            // successFunction();//, textStatus, jqXHR);
            console.log('game load');
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };

    // if (completeFunction !== undefined) request.complete = completeFunction;

    $.ajax(request);
}

$(document).ready(() => {
    init();
});


function init() {
    $('#getGames').on('click', () => {
        getGames(showResponse, showError);
    });
}


function showGames(games) {
    games.forEach(game => {
        let $btn = $('<button>').text(game.title).on('click', () => {
            localStorage.setItem('game_id', game._id);
            startGame(game._id);
            $('#gameFrame').attr('src', serverStatic + game.link);
        });
        $('#gallery').append($btn);
    });
}


// function startGameIframe(){
//     $('#gameFrame')
// }


function showResponse(data) {
    console.log(data);
    $('#response').text(JSON.stringify(data, null, 2));
}


function showError(status, responseText) {
    $('#error').text(`ERROR: ${status}, ${responseText}`);
}

// const sock = io();