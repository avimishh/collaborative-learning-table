import { getServerApiUrl } from "../../globalDeclarations.js";

const server = getServerApiUrl();
const childsApi = server + "childs/";
const statsApi = server + "stats/";

export function childLoginRequest(childId, gamesPassword, successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: childsApi + childId + "/" + gamesPassword,
        method: "GET",
        // data: JSON.stringify(),
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}

export function getStatsRequest(childId, fieldId, successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: statsApi + childId + '/' + fieldId,
        method: "GET",
        // data: JSON.stringify(),
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}

export function getChildsRequest(successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: childsApi,
        method: "GET",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        // data: JSON.stringify({}),
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}