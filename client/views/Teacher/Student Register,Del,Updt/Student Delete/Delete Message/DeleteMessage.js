
let obj = JSON.parse(sessionStorage.getItem("user"));
//console.log(obj.firstName + obj.lastName);
$('#fullName').text(obj.firstName + " " + obj.lastName);