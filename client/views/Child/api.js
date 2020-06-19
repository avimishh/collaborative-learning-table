const server = "http://localhost:3000/api/";
const childsApi = server + "childs/";
const mathStatsApi = server + "mathStats/";


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


export function getStatsRequest(childId, successFunction, errorFunction, completeFunction) {
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: mathStatsApi + childId, //+ "/" + gamesPassword,
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