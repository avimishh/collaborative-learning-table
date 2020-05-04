
function idUpdate() {
    console.log($("#id_update").val());

    let userObj = JSON.stringify({
        id: $("#id_update").val()
    });
    sessionStorage.setItem("user", userObj);
    window.location.href = '../Student_Update_Teacher.html'
}
