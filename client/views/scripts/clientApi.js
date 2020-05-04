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
            // data._id = '5ea98c3556adcc84503d58ca';
            console.log('child_id: ' + data._id);
            localStorage.setItem('child_id', data._id);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}