const server = "http://localhost:3000/api/";
const authApi = server + "auth/teacher/";
const usersApi = server + "users/";
const teachersApi = server + "teachers/";
const childsApi = server + "childs/";


export function getChildRequest(childId, successFunction, errorFunction, completeFunction) {
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: childsApi + childId,
        method: "GET",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
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
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


export function userRegisterRequest(userId, userPassword, successFunction, errorFunction, completeFunction) {
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: teachersApi,
        method: "POST",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify({
            userId: userId,
            password: userPassword
        }),
        success: function (data, textStatus, xhr) {
            localStorage.setItem('token', xhr.getResponseHeader('x-auth-token'));
            // console.log(data);
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
        url: teachersApi + "me/",
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


export function getTeacherRequest(teacher_id, successFunction, errorFunction, completeFunction) {
    console.log(teacher_id);
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: teachersApi + teacher_id,
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


export function updateTeacherRequest(teacher_id, teacherToUpdate, successFunction, errorFunction, completeFunction) {
    // console.log(teacherToUpdate);
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: teachersApi + teacher_id,
        method: "PUT",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify(teacherToUpdate),
        success: function (data, textStatus, xhr) {
            localStorage.setItem('teacher', JSON.stringify(data));
            // console.log(data);
            successFunction();
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}


export function firstDetailsTeacherRequest(teacherToUpdate, successFunction, errorFunction, completeFunction) {
    console.log('work api');
    let request = {
        contentType: "application/json",
        url: teachersApi,
        method: "POST",
        headers: { 'x-auth-token' : localStorage.getItem('token') },
        data: JSON.stringify(teacherToUpdate),
        success: function (data, textStatus, xhr) {
            localStorage.setItem('teacher', JSON.stringify(data));
            // console.log(data);
            successFunction();
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}