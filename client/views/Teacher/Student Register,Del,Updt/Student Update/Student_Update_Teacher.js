const server = "http://localhost:3000/api/";
const usersApi = server + "childs/";
const authApi = server + "auth";

function update() {

    let obj = JSON.parse(sessionStorage.getItem("user"));
    console.log(obj.id);

    let studentToUpdate = {
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
        url: usersApi + obj.id,
        contentType: "application/json; charset=utf-8",
        type: "PUT",
        data: JSON.stringify(studentToUpdate),
        success: function (data) {
            //console.log(data.firstName + data.lastName);
            let userObj1 = JSON.stringify({
                firstName: data.firstName,
                lastName: data.lastName
            });
            sessionStorage.setItem("user", userObj1);
            window.location.href = 'Update Message/UpdateMessage.html';
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


