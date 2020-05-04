const server = "http://localhost:3000/api/";
const usersApi = server + "childs";
const authApi = server + "auth";

function register() {
    let studentToRegister = {
        firstName: $("#firstName").val(),                       // firstName
        lastName: $("#lastName").val(),                         // lastName
        id: $("#ID").val(),                                     // id
        birth: $("#birthDate").val(),                           // birthDate
        gender: $('#male').is(':checked') ? true : false,       // gender
        gamesPassword: $("#password").val(),                    // password
        address: $("#address").val(),                           // address
        phone: $("#phoneNumber").val(),                         // phoneNumber
        level: $("#classNumber").val()                          // classNumber
    };

    let request = {
        dataType: "json",
        url: usersApi,
        contentType: "application/json; charset=utf-8",
        type: "POST",
        data: JSON.stringify(studentToRegister),
        success: function (data) {
            let userObj = JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName
            });
            sessionStorage.setItem("user", userObj);
            window.location.href = 'Register Message/RegisterMessage.html';
            //location.reload();
            //ShowAll();
        },
        error: function (err) {
            console.log(err);
        }
    };

    console.log('alive');
    $.ajax(request);
}


