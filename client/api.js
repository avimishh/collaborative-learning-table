Webimport { getServerApiUrl } from "/globalDeclarations.js";

const server = getServerApiUrl();
const childsApi = server + "childs/";
const statsApi = server + "stats/";
const authParentApi = server + "auth/parent/";
const usersApi = server + "users/";
const parentsApi = server + "parents/";
const notesApi = server + "notes/";

$.ajaxSetup({
    contentType: "application/json"
});

export function childLoginRequest(childId, gamesPassword, successFunction, errorFunction) {
    $.ajax({
        url: childsApi + childId + "/" + gamesPassword,
        method: "GET",
        // data: JSON.stringify(),
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    });
}

export function userLoginRequest(userId, userPassword, successFunction, errorFunction) {
    let request = {
        url: authParentApi,
        method: "POST",
        data: JSON.stringify({
            id: userId,
            password: userPassword
        }),
        success: function (data, textStatus, xhr) {
            localStorage.setItem('token', xhr.getResponseHeader('x-auth-token'));
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}



export function getStatsRequest(childId, fieldId, successFunction, errorFunction) {
    let request = {
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
//@@authorization
export function getChildsRequest(successFunction, errorFunction) {
    let request = {
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