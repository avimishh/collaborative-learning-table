import { getServerApiUrl } from "../../globalDeclarations.js";

const server = getServerApiUrl();
const childsApi = server + "childs/";
const statsApi = server + "stats/";

console.log(server);

export function childLoginRequest(childId, gamesPassword, successFunction, errorFunction, completeFunction) {
    console.log('work api');
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
    console.log('work api');
    console.log(fieldId);
    let request = {
        contentType: "application/json",
        url: statsApi + childId + '/' + fieldId,
        method: "GET",
        // data: JSON.stringify(),
        success: function (data, textStatus, xhr) {
            console.log('a');
            successFunction(data);
        },
        error: function (xhr) {
            console.log('b');
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}

export function getChildsRequest(successFunction, errorFunction, completeFunction) {
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: childsApi,
        method: "GET",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        // data: JSON.stringify({}),
        success: function (data, textStatus, xhr) {
            // console.log(data);
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}

// export function getStatsRequest(childId, fieldId, successFunction, errorFunction, completeFunction) {
//     console.log('work api');
//     let request = {
//         contentType: "application/json",
//         url: mathStatsApi + childId, //+ "/" + gamesPassword,
//         method: "GET",
//         // data: JSON.stringify(),
//         success: function (data, textStatus, xhr) {
//             console.log('a');
//             successFunction(data);
//         },
//         error: function (xhr) {
//             console.log('b');
//             errorFunction(xhr.status, xhr.responseText);
//         }
//     };
//     $.ajax(request);
// }