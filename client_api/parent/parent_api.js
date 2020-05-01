const server = "http://localhost:3000/api/";
const usersApi = server + "users/";
const parentsApi = server + "parents/";


function updateParentDetails(parent, successFunction, errorFunction, completeFunction) {
    // if (userId === undefined || password === undefined || successFunction === undefined) return;

    let request = {
        contentType: "application/json",
        url: parentsApi,
        method: "POST",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify(parent),
        success: function (data, textStatus, xhr) {
            // sessionStorage.setItem(tokenStorageKeyString, data.token);
            successFunction(data);//, textStatus, jqXHR);
        },
        error: function (xhr) {
            // console.log(xhr.status);
            // console.log(xhr.responseText);
            errorFunction(xhr.status, xhr.responseText);
        }
    };

    // if (errorFunction !== undefined) request.error = errorFunction;
    // if (completeFunction !== undefined) request.complete = completeFunction;

    $.ajax(request);
}

$(document).ready(() => {
    init();
});


function init(){
    console.log(localStorage.getItem('token'));
    $('#submit').on('click', () => {
        let parent = {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val(),
            id: $('#id_number').val(),
            phone: $('#phone').val()
        }
        updateParentDetails(parent, showResponse, showError);
    });
}


function showResponse(data){
    console.log(data);
    $('#response').text(JSON.stringify(data, null, 2));
    // $('#response').append($('<button>').val('Move to Parent Page').on('click', "window.location.href='./parent/parent.html'"));
}


function showError(status, responseText){
    $('#error').text(`ERROR: ${status}, ${responseText}`);
}