import { getServerApiUrl, globalInit } from "../../globalDeclarations.js";

const server = getServerApiUrl();
const authApi = server + "auth/parent/";
const usersApi = server + "users/";
const parentsApi = server + "parents/";
const childsApi = server + "childs/";
const notesApi = server + "notes/";



export function userLoginRequest(userId, userPassword, successFunction, errorFunction, completeFunction) {
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
            localStorage.setItem('token', xhr.getResponseHeader('x-auth-token'));
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


export function userRegisterRequest(newUser, successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: parentsApi,
        method: "POST",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify(newUser),
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


export function getUserRequest(successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: usersApi + "me/",
        method: "GET",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
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


export function getParentRequest(parent_id, successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: parentsApi + parent_id,
        method: "GET",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
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


export function getParentsRequest(successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: parentsApi,
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


export function updateParentRequest(parent_id, parentToUpdate, successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: parentsApi + parent_id,
        method: "PUT",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify(parentToUpdate),
        success: function (data, textStatus, xhr) {
            localStorage.setItem('parent', JSON.stringify(data));
            successFunction();
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


export function updateParentPasswordRequest(parent_id, newPassword, successFunction, errorFunction) {
    let request = {
      contentType: "application/json",
      url: parentsApi + 'changePassword/' + parent_id,
      method: "PUT",
      headers: {
        'x-auth-token': localStorage.getItem('token')
      },
      data: JSON.stringify({newPassword}),
      success: function (data, textStatus, xhr) {
        successFunction();
      },
      error: function (xhr) {
        errorFunction(xhr.status, xhr.responseText);
      }
    };
    $.ajax(request);
  }

export function getChildRequest(child_id, successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: childsApi + child_id,
        method: "GET",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
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


export function getChildNotesRequest(child_id, successFunction, errorFunction, completeFunction) {
    let request = {
        contentType: "application/json",
        url: notesApi + child_id,
        method: "GET",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
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