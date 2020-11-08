import {
    getServerApiUrl
} from "/globalDeclarations.js";

const server = getServerApiUrl();
const authApi = server + "auth/";
const childsApi = server + "childs/";
const parentsApi = server + "parents/";
const teachersApi = server + "teachers/";
const statsApi = server + "stats/";
const notesApi = server + "notes/";
const gamesApi = server + "games/";

$.ajaxSetup({
    contentType: "application/json"
});

function getApiRouteByUserType(userType) {
    let urlApi;
    switch (userType) {
        case "child":
            urlApi = childsApi;
            break;
        case "teacher":
            urlApi = teachersApi;
            break;
        case "parent":
            urlApi = parentsApi;
            break;
        default:
            break;
    }
    return urlApi;
}

//#region Login Requests

export function childLoginRequest(childId, gamesPassword, successFunction, errorFunction) {
    if(childId.length < 2 || gamesPassword.length < 2)
        return;
    $.ajax({
        url: childsApi + "login/",
        method: "POST",
        data: JSON.stringify({
            id:childId,
            password: gamesPassword
        }),
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    });
}

export function userLoginRequest(userType, userId, userPassword, successFunction, errorFunction) {
    $.ajax({
        url: authApi + userType,
        method: "POST",
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
    });
}
//#endregion

//#region Register Requests

export function childRegisterRequest({
    firstName,
    lastName,
    id,
    birth,
    gender,
    address,
    phone,
    level,
    gamesPassword
}, successFunction, errorFunction) {
    let newChildData = arguments[0];
    userRegisterRequest("child", newChildData, successFunction, errorFunction)
}

export function teacherRegisterRequest(firstName, lastName, id, password, phone, successFunction, errorFunction) {
    let newTeacherData = {
        firstName,
        lastName,
        id,
        password,
        phone
    };
    userRegisterRequest("teacher", newTeacherData, successFunction, errorFunction)
}

export function parentRegisterRequest(firstName, lastName, id, password, phone, successFunction, errorFunction) {
    let newParentData = {
        firstName,
        lastName,
        id,
        password,
        phone
    };
    userRegisterRequest("parent", newParentData, successFunction, errorFunction)
}

function userRegisterRequest(userType, newUserData, successFunction, errorFunction) {
    $.ajax({
        url: getApiRouteByUserType(userType),
        method: "POST",
        headers: {
            'x-auth-token': localStorage.getItem('token')
        },
        data: JSON.stringify(newUserData),
        success: function (data, textStatus, xhr) {
            if (userType === "parent")
                localStorage.setItem("token", xhr.getResponseHeader("x-auth-token"));
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        },
    });
}
//#endregion


//#region Get Model Data Requests

export function getMeUserRequest(userType, successFunction, errorFunction) {
    $.ajax({
        url: getApiRouteByUserType(userType) + "me/",
        method: "GET",
        headers: {
            'x-auth-token': localStorage.getItem('token')
        },
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    });
}

export function getChildByIdRequest(childId, successFunction, errorFunction) {
    getModelObjectByIdRequest("child", childId, successFunction, errorFunction)
}

export function getTeacherByIdRequest(teacherId, successFunction, errorFunction) {
    getModelObjectByIdRequest("teacher", teacherId, successFunction, errorFunction)
}

export function getParentByIdRequest(parentId, successFunction, errorFunction) {
    getModelObjectByIdRequest("parent", parentId, successFunction, errorFunction)
}

export function getChildsRequest(successFunction, errorFunction) {
    getModelObjectsRequest("child", successFunction, errorFunction)
}

export function getTeachersRequest(successFunction, errorFunction) {
    getModelObjectsRequest("teacher", successFunction, errorFunction)
}

export function getParentsRequest(successFunction, errorFunction) {
    getModelObjectsRequest("parent", successFunction, errorFunction)
}

function getModelObjectByIdRequest(userType, userId, successFunction, errorFunction) {
    $.ajax({
        url: getApiRouteByUserType(userType) + userId,
        method: "GET",
        headers: {
            "x-auth-token": localStorage.getItem("token")
        },
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        },
    });
}

function getModelObjectsRequest(userType, successFunction, errorFunction) {
    $.ajax({
        url: getApiRouteByUserType(userType),
        method: "GET",
        headers: {
            'x-auth-token': localStorage.getItem('token')
        },
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    });
}
//#endregion


//#region Change Model Data Requests

export function updateChildByIdRequest(childId, updatedChild, successFunction, errorFunction) {
    updateModelObjectByIdRequest("child", childId, updatedChild, successFunction, errorFunction)
}

export function updateTeacherByIdRequest(teacherId, updatedTeacher, successFunction, errorFunction) {
    updateModelObjectByIdRequest("teacher", teacherId, updatedTeacher, successFunction, errorFunction)
}

export function updateParentByIdRequest(parentId, updatedParent, successFunction, errorFunction) {
    updateModelObjectByIdRequest("parent", parentId, updatedParent, successFunction, errorFunction)
}

export function updateTeacherPasswordByIdRequest(teacherId, newPassword, successFunction, errorFunction) {
    updateUserPasswordByIdRequest("teacher", teacherId, newPassword, successFunction, errorFunction)
}

export function updateParentPasswordByIdRequest(parentId, newPassword, successFunction, errorFunction) {
    updateUserPasswordByIdRequest("parent", parentId, newPassword, successFunction, errorFunction)
}

export function deleteChildByIdRequest(childId, successFunction, errorFunction) {
    deleteModelObjectByIdRequest("child", childId, successFunction, errorFunction)
}

export function deleteTeacherByIdRequest(teacherId, successFunction, errorFunction) {
    deleteModelObjectByIdRequest("teacher", teacherId, successFunction, errorFunction)
}

export function deleteParentByIdRequest(parentId, successFunction, errorFunction) {
    deleteModelObjectByIdRequest("parent", parentId, successFunction, errorFunction)
}

function updateModelObjectByIdRequest(userType, userId, objectToUpdate, successFunction, errorFunction) {
    $.ajax({
        url: getApiRouteByUserType(userType) + userId,
        method: "PUT",
        headers: {
            'x-auth-token': localStorage.getItem('token')
        },
        data: JSON.stringify(objectToUpdate),
        success: function (data, textStatus, xhr) {
            // localStorage.setItem('teacher', JSON.stringify(data));
            // Store Object data in localStorage
            localStorage.setItem(userType, JSON.stringify(data));
            successFunction();
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    });
}

function updateUserPasswordByIdRequest(userType, userId, newPassword, successFunction, errorFunction) {
    $.ajax({
        url: getApiRouteByUserType(userType) + 'changePassword/' + userId,
        method: "PUT",
        headers: {
            'x-auth-token': localStorage.getItem('token')
        },
        data: JSON.stringify({
            newPassword
        }),
        success: function (data, textStatus, xhr) {
            successFunction();
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    });
}

function deleteModelObjectByIdRequest(userType, userId, successFunction, errorFunction) {
    $.ajax({
        url: getApiRouteByUserType(userType) + userId,
        method: "DELETE",
        headers: {
            'x-auth-token': localStorage.getItem('token')
        },
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    });
}
//#endregion


//#region Child Notes Requests

export function getChildNotesRequest(childId, successFunction, errorFunction) {
    $.ajax({
        url: notesApi + childId,
        method: "GET",
        headers: {
            'x-auth-token': localStorage.getItem('token')
        },
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    });
}

export function postChildNotesRequest(childId, teacherId, noteContent, successFunction, errorFunction) {
    $.ajax({
        url: notesApi + childId,
        method: "POST",
        headers: {
            "x-auth-token": localStorage.getItem("token")
        },
        data: JSON.stringify({
            teacherId,
            noteContent
        }),
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        },
    });
}
//#endregion


export function getStatsRequest(childId, fieldId, successFunction, errorFunction) {
    let request = {
        url: statsApi + childId + '/' + fieldId,
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

export function getGamesRequest(successFunction, errorFunction) {
    let request = {
        contentType: "application/json",
        url: gamesApi,
        method: "GET",
        // headers: { 'x-auth-token' : localStorage.getItem('token') },
        success: function (data, textStatus, xhr) {
            successFunction(data);
        },
        error: function (xhr) {
            errorFunction(xhr.status, xhr.responseText);
        }
    };
    $.ajax(request);
}