import {
  getServerApiUrl
} from "../../globalDeclarations.js";

const server = getServerApiUrl();
const authApi = server + "auth/teacher/";
const usersApi = server + "users/";
const teachersApi = server + "teachers/";
const childsApi = server + "childs/";
const notesApi = server + "notes/";

export function getChildsRequest(successFunction, errorFunction) {
  console.log("work api");
  let request = {
    contentType: "application/json",
    url: childsApi,
    method: "GET",
    headers: {
      "x-auth-token": localStorage.getItem("token")
    },
    // data: JSON.stringify({}),
    success: function (data, textStatus, xhr) {
      successFunction(data);
    },
    error: function (xhr) {
      errorFunction(xhr.status, xhr.responseText);
    },
  };
  $.ajax(request);
}

export function getChildRequest(childId, successFunction, errorFunction, completeFunction) {
  console.log("work api");
  let request = {
    contentType: "application/json",
    url: childsApi + childId,
    method: "GET",
    headers: {
      "x-auth-token": localStorage.getItem("token")
    },
    // data: JSON.stringify({}),
    success: function (data, textStatus, xhr) {
      // console.log(data);
      successFunction(data);
    },
    error: function (xhr) {
      errorFunction(xhr.status, xhr.responseText);
    },
  };
  $.ajax(request);
}

export function childRegisterRequest(newChild, successFunction, errorFunction) {
  console.log("work api");
  let request = {
    contentType: "application/json",
    url: childsApi,
    method: "POST",
    headers: {
      'x-auth-token': localStorage.getItem('token')
    },
    data: JSON.stringify(newChild),
    success: function (data, textStatus, xhr) {
      // console.log(data);
      successFunction(data);
    },
    error: function (xhr) {
      errorFunction(xhr.status, xhr.responseText);
    },
  };
  $.ajax(request);
}

export function childUpdateRequest(toUpdateChild, successFunction, errorFunction) {
  console.log("work api");
  let request = {
    contentType: "application/json",
    url: childsApi + toUpdateChild.id,
    method: "PUT",
    headers: {
      'x-auth-token': localStorage.getItem('token')
    },
    data: JSON.stringify(toUpdateChild),
    success: function (data, textStatus, xhr) {
      // console.log(data);
      successFunction(data);
    },
    error: function (xhr) {
      errorFunction(xhr.status, xhr.responseText);
    },
  };
  $.ajax(request);
}

export function deleteChildRequest(toDeleteChildId, successFunction, errorFunction) {
  console.log("work api");
  let request = {
    contentType: "application/json",
    url: childsApi + toDeleteChildId,
    method: "DELETE",
    headers: {
      'x-auth-token': localStorage.getItem('token')
    },
    // data: JSON.stringify(),
    success: function (data, textStatus, xhr) {
      // console.log(data);
      successFunction(data);
    },
    error: function (xhr) {
      errorFunction(xhr.status, xhr.responseText);
    },
  };
  $.ajax(request);
}

export function teacherRegisterRequest(user, successFunction, errorFunction, completeFunction) {
  console.log('work api');
  let request = {
    contentType: "application/json",
    url: teachersApi,
    method: "POST",
    // headers: { 'x-auth-token' : localStorage.getItem('token') },
    data: JSON.stringify(user),
    success: function (data, textStatus, xhr) {
      localStorage.setItem('token', xhr.getResponseHeader('x-auth-token'));
      //  console.log(data);
      successFunction(data);
    },
    error: function (xhr) {
      // console.log(xhr.status, xhr.responseText);
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
    headers: {
      'x-auth-token': localStorage.getItem('token')
    },
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

export function userLoginRequest(userId, userPassword, successFunction, errorFunction, completeFunction) {
  console.log("work api");
  let request = {
    contentType: "application/json",
    url: authApi,
    method: "POST",
    // headers: { 'x-auth-token' : localStorage.getItem('token') },
    data: JSON.stringify({
      id: userId,
      password: userPassword,
    }),
    success: function (data, textStatus, xhr) {
      // console.log(data);
      localStorage.setItem("token", xhr.getResponseHeader("x-auth-token"));
      successFunction(data);
    },
    error: function (xhr) {
      errorFunction(xhr.status, xhr.responseText);
    },
  };
  $.ajax(request);
}

export function userRegisterRequest(userId, userPassword, successFunction, errorFunction, completeFunction) {
  console.log("work api");
  let request = {
    contentType: "application/json",
    url: teachersApi,
    method: "POST",
    // headers: { 'x-auth-token' : localStorage.getItem('token') },
    data: JSON.stringify({
      userId: userId,
      password: userPassword,
    }),
    success: function (data, textStatus, xhr) {
      localStorage.setItem("token", xhr.getResponseHeader("x-auth-token"));
      // console.log(data);
      successFunction(data);
    },
    error: function (xhr) {
      errorFunction(xhr.status, xhr.responseText);
    },
  };
  $.ajax(request);
}

export function getTeachersRequest(successFunction, errorFunction, completeFunction) {
  console.log('work api');
  let request = {
    contentType: "application/json",
    url: teachersApi,
    method: "GET",
    // headers: { 'x-auth-token' : localStorage.getItem('token') },
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


export function deleteTeacherRequest(teacher_id, successFunction, errorFunction, completeFunction) {
  console.log(teacher_id);
  console.log('work api');
  let request = {
    contentType: "application/json",
    url: teachersApi + teacher_id,
    method: "DELETE",
    // headers: { 'x-auth-token' : localStorage.getItem('token') },
    // data: JSON.stringify({}),
    success: function (data, textStatus, xhr) {
      // console.log(data);
      successFunction(data);
    },
    error: function (xhr) {
      // console.log(xhr.status, xhr.responseText);
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
    headers: {
      'x-auth-token': localStorage.getItem('token')
    },
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

export function getTeacherRequest(teacher_id, successFunction, errorFunction, completeFunction) {
  console.log(teacher_id);
  console.log("work api");
  let request = {
    contentType: "application/json",
    url: teachersApi + teacher_id,
    method: "GET",
    headers: {
      "x-auth-token": localStorage.getItem("token")
    },
    // data: JSON.stringify(),
    success: function (data, textStatus, xhr) {
      console.log(data);
      successFunction(data);
    },
    error: function (xhr) {
      errorFunction(xhr.status, xhr.responseText);
    },
  };
  $.ajax(request);
}


export function firstDetailsTeacherRequest(teacherToUpdate, successFunction, errorFunction, completeFunction) {
  console.log("work api");
  let request = {
    contentType: "application/json",
    url: teachersApi,
    method: "POST",
    headers: {
      "x-auth-token": localStorage.getItem("token")
    },
    data: JSON.stringify(teacherToUpdate),
    success: function (data, textStatus, xhr) {
      localStorage.setItem("teacher", JSON.stringify(data));
      // console.log(data);
      successFunction();
    },
    error: function (xhr) {
      errorFunction(xhr.status, xhr.responseText);
    },
  };
  $.ajax(request);
}

export function postChildNotesRequest(childId, newNote, successFunction, errorFunction, completeFunction) {
  console.log(childId);
  console.log(newNote);
  console.log("work api");
  let request = {
    contentType: "application/json",
    url: notesApi + childId,
    method: "POST",
    headers: {
      "x-auth-token": localStorage.getItem("token")
    },
    data: JSON.stringify(newNote),
    success: function (data, textStatus, xhr) {
      // console.log(data);
      successFunction(data);
    },
    error: function (xhr) {
      errorFunction(xhr.status, xhr.responseText);
    },
  };
  $.ajax(request);
}