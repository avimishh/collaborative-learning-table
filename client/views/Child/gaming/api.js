const server = "http://localhost:3000/api/";
const serverStatic = "http://localhost:3000/static/"
const gamesApi = server + "games/";
const childsApi = server + "childs/";
const playGamesApi = server + "playGames/";


export function getGamesRequest(successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: gamesApi,
        method: "GET",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        // data: JSON.stringify(parent),
        success: function (data, textStatus, xhr) {
            // successFunction(data);//, textStatus, jqXHR);
            successFunction(data);
        },
        error: function (xhr) {
            // errorFunction(xhr.status, xhr.responseText);
        }
    };

    // if (completeFunction !== undefined) request.complete = completeFunction;

    $.ajax(request);
}


export function startGameRequest(gameId, successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: playGamesApi + "start/",
        method: "POST",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify({
            child_id: localStorage.getItem('child_id'),
            game_id: localStorage.getItem('game_id')
        }),
        success: function (data, textStatus, xhr) {
            // console.log(data);
            localStorage.setItem('statsObject_id', data._id);
            console.log('statsObject_id: ' + data._id);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };

    $.ajax(request);
}


function showResponse(data) {
    console.log(data);
    $('#response').text(JSON.stringify(data, null, 2));
}


function showError(status, responseText) {
    $('#error').text(`ERROR: ${status}, ${responseText}`);
}