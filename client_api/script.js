// import * as api from './api.js';

$(document).ready(() => {
    init();
});


function init(){
    $('#submit').on('click', () => {
        let user = {
            userId: $('#userId').val(),
            password: $('#password').val()
        }
        api.registerUser(user, showResult);
    });
}


function showResponse(data){
    $('#response').text(data);
}