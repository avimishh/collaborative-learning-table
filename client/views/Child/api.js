const server = "http://localhost:3000/api/";
const childsApi = server + "childs/";
// const mathStatsApi = server + "mathStats/";
const statsApi = server + "stats/";


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