const server = "http://localhost:3000/api/";
const usersApi = server + "childs/";
const authApi = server + "auth";

function studentDelete() {

    let request = {
        dataType: "json",
        url: usersApi + $("#id_delete").val(),
        contentType: "application/json; charset=utf-8",
        type: "DELETE",
        //data: JSON.stringify(),
        success: function (data) {
            //console.log(data.firstName + data.lastName);
            let userObj = JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName
            });
            sessionStorage.setItem("user", userObj);
            window.location.href = '../Delete Message/DeleteMessage.html';
            //location.reload();
            //ShowAll();
        },
        error: function (err) {
            console.log(err);
        }
    };

    $.ajax(request);
}


