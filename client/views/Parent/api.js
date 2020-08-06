const server = "http://localhost:3000/api/";
const authApi = server + "auth/parent/";
const usersApi = server + "users/";
const parentsApi = server + "parents/";


export function userLoginRequest(userId, userPassword, successFunction, errorFunction, completeFunction) {
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: authApi,
        method: "POST",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify({
            id: userId,
            password: userPassword
        }),
        success: function (data, textStatus, xhr) {
            // console.log(data);
            localStorage.setItem('token', xhr.getResponseHeader('x-auth-token'));
            // console.log(localStorage.getItem('token'));
            // console.log(data);
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


export function userRegisterRequest(newUser, successFunction, errorFunction, completeFunction) {
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: parentsApi,
        method: "POST",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify(newUser),
        success: function (data, textStatus, xhr) {
            localStorage.setItem('token', xhr.getResponseHeader('x-auth-token'));
            // console.log(localStorage.getItem('token'));
            console.log(data);
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


export function getUserRequest(successFunction, errorFunction, completeFunction) {
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: usersApi + "me/",
        method: "GET",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
        // data: JSON.stringify(),
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


export function getParentRequest(parent_id, successFunction, errorFunction, completeFunction) {
    console.log(parent_id);
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: parentsApi + parent_id,
        method: "GET",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
        // data: JSON.stringify(),
        success: function (data, textStatus, xhr) {
            console.log(data);
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


export function updateParentRequest(parent_id, parentToUpdate, successFunction, errorFunction, completeFunction) {
    // console.log(parentToUpdate);
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: parentsApi + parent_id,
        method: "PUT",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify(parentToUpdate),
        success: function (data, textStatus, xhr) {
            localStorage.setItem('parent', JSON.stringify(data));
            // console.log(data);
            successFunction();
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


export function firstDetailsParentRequest(parentToUpdate, successFunction, errorFunction, completeFunction) {
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: parentsApi,
        method: "POST",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify(parentToUpdate),
        success: function (data, textStatus, xhr) {
            localStorage.setItem('parent', JSON.stringify(data));
            // console.log(data);
            successFunction();
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}