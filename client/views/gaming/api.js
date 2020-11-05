import {
    getServerApiUrl
} from "../../globalDeclarations.js";

const server = getServerApiUrl();
const serverStatic = "http://localhost:3000/static/"
const gamesApi = server + "games/";

export function getGamesRequest(successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: gamesApi,
        method: "GET",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            // errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


function showResponse(data) {
    $('#response').text(JSON.stringify(data, null, 2));
}

function showError(status, responseText) {
    $('#error').text(`ERROR: ${status}, ${responseText}`);
}