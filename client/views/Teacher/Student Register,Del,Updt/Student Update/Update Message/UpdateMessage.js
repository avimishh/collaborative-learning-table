
let obj1 = JSON.parse(sessionStorage.getItem("user"));
//console.log(obj.firstName + obj.lastName);
$('#fullName').text(obj1.firstName + " " + obj1.lastName);