// requires jQuery
const server = "http://localhost:3000/api";
const usersApi = server + "/users";
const authApi = server + "/auth";

const tokenStorageKeyString = "api-token";


$.ajaxSetup({
    statusCode: {
        401: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.responseText !== "5") {
                alert("Your session has expired, please login again.");
                parent.logout();
            }
        }
    }
});



/**
 * Registers a new user.
 * @param {string}      username            The new user's username.
 * @param {string}      password            The new user's password.
 * @param {function=}   successFunction     Function to execute upon success.
 * @param {function=}   errorFunction       Function to execute upon failure.
 * @param {function=}   completeFunction    Function to execute upon completion.
 */
function registerUser(username, password, successFunction, errorFunction, completeFunction) {
    if (username === undefined || password === undefined || successFunction === undefined) return;

    let request = {
        contentType: "application/json",
        url: authApi + "/register",
        method: "POST",
        data: JSON.stringify({
            Username: username,
            Password: password
        }),
        success: function (data, textStatus, jqXHR) {
            sessionStorage.setItem(tokenStorageKeyString, data.token);
            successFunction(data, textStatus, jqXHR);
        }
    };

    if (errorFunction !== undefined) request.error = errorFunction;
    if (completeFunction !== undefined) request.complete = completeFunction;

    $.ajax(request);
}



/**
 * Signs a user in. (Gets an API token).
 * @param {string}      username            The new user's username.
 * @param {string}      password            The new user's password.
 * @param {function}    successFunction     Function to execute upon success.
 * @param {function=}   errorFunction       Function to execute upon failure.
 * @param {function=}   completeFunction    Function to execute upon completion.
 */
function loginUser(username, password, successFunction, errorFunction, completeFunction) {
    if (username === undefined || password === undefined || successFunction === undefined) return;

    let request = {
        contentType: "application/json",
        url: authApi + "/login",
        method: "POST",
        data: JSON.stringify({
            Username: username,
            Password: password
        }),
        success: function (data, textStatus, jqXHR) {
            sessionStorage.setItem(tokenStorageKeyString, data.token);
            successFunction(data, textStatus, jqXHR);
        }
    };

    if (errorFunction !== undefined) request.error = errorFunction;
    if (completeFunction !== undefined) request.complete = completeFunction;

    $.ajax(request);
}



/**
 * Changes an existing user's password.
 * @param {string}      username            The existing user's username.
 * @param {string}      oldPassword         The user's old password.
 * @param {string}      newPassword         The user's new password.
 * @param {function}    successFunction     Function to execute upon success.
 * @param {function=}   errorFunction       Function to execute upon failure.
 * @param {function=}   completeFunction    Function to execute upon completion.
 */
function changePassword(username, oldPassword, newPassword, successFunction, errorFunction, completeFunction) {
    if (username === undefined || oldPassword === undefined || newPassword === undefined) return;

    let request = {
        url: usersApi + "/" + username + "/password",
        contentType: "application/json",
        headers: { "x-auth-token": sessionStorage.getItem(tokenStorageKeyString) },
        method: "PUT",
        data: JSON.stringify({ "OldPassword": oldPassword, "NewPassword": newPassword })
    };

    if (successFunction !== undefined) request.success = successFunction;
    if (errorFunction !== undefined) request.error = errorFunction;
    if (completeFunction !== undefined) request.complete = completeFunction;

    $.ajax(request);
}