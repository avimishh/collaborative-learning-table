
function idUser() {
    console.log($("#id_user").val());

    let userObj = JSON.stringify({
        id: $("#id_user").val()
    });
    sessionStorage.setItem("user", userObj);
    window.location.href = '../../../User/Student details User/StudentDetails_User.html'
}
