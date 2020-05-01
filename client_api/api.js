const server = "http://localhost:3000/api/";
const usersApi = server + "users/";

/**
 * Registers a new user.
 * @param {string}      userId            The new user's userId.
 * @param {string}      password            The new user's password.
 * @param {function=}   successFunction     Function to execute upon success.
 * @param {function=}   errorFunction       Function to execute upon failure.
 * @param {function=}   completeFunction    Function to execute upon completion.
 */
function registerUser(user, successFunction, errorFunction, completeFunction) {
    // if (userId === undefined || password === undefined || successFunction === undefined) return;

    let request = {
        contentType: "application/json",
        url: usersApi,
        method: "POST",
        data: JSON.stringify({
            userId: user.userId,
            password: user.password
        }),
        success: function (data, textStatus, xhr) {
            // jqXHR.getResponseHeader('x-auth-token');
            // console.log(xhr.getAllResponseHeaders());
            // console.log('jwt:' + xhr.getResponseHeader('x-auth-token'));
            localStorage.setItem('token', xhr.getResponseHeader('x-auth-token'));
            console.log(localStorage.getItem('token'));
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
    $('#submit').on('click', () => {
        let user = {
            userId: $('#userId').val(),
            password: $('#password').val()
        }
        registerUser(user, showResponse, showError);
    });
}

//"window.location.href='./parent/parent.html'"
function showResponse(data){
    console.log(data);
    $('#response').text(JSON.stringify(data, null, 2));
    $('#response').append($('<button>').text('Move to Parent Page').on('click', () => {
        location.replace('./parent/parent.html');
    }));
}


function showError(status, responseText){
    // console.log(data);
    // $('#error').text('aa');
    $('#error').text(`ERROR: ${status}, ${responseText}`);
}