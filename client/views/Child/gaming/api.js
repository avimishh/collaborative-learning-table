import {
    getServerApiUrl
} from "../../../globalDeclarations.js";


const server = getServerApiUrl();
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
    $.ajax(request);
}


function showResponse(data) {
    console.log(data);
    $('#response').text(JSON.stringify(data, null, 2));
}


function showError(status, responseText) {
    $('#error').text(`ERROR: ${status}, ${responseText}`);
}