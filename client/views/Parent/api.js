const server = "http://localhost:3000/api/";
const childsApi = server + "childs/";


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