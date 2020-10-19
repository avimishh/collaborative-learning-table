$(document).ready(function () {
    numbers_pad_init();
    addButtonListeners();
    sock.emit('fromClient_toServer_startGame');
    // console.log('run');
});


// Game pad buttons initizalization
function numbers_pad_init() {
    var numbers_buttons = [];

    for (let i = 0; i < 10; i++) {
        let $btn = $("<button>").text(i);
        // w3-css style
        $btn.addClass('w3-button w3-round-xxlarge');
        $btn.on('click', function () {
            // console.log('DEBUG: ' + $(this).text());
            write_answer($(this).text());
        });
        numbers_buttons.push($btn);
    }

    for (let i = 1; i < 10; i++) {
        $("#numbers_pad").append(numbers_buttons[i]);
        if ((i % 3) === 0) $("#numbers_pad").append($("<br>"));
    }
    $("#numbers_pad").append(numbers_buttons[0]);


    set_game_pad_state('disable');
}

// math op init
function addButtonListeners() {
    var subFields = ['plus','minus','multi'];

    subFields.forEach(subField => {
        $(`#${subField}`).click( () => {sock.emit('fromClient_toServer_notify_subField_selected', subField)});
    });
}



function setMathOperators() {
    let $img1 = $('<img>').attr('src', './plus.png').addClass('img_op');
    let $img2 = $('<img>').attr('src', './minus.png').addClass('img_op');
    let $img3 = $('<img>').attr('src', './multi.png').addClass('img_op');

    $('#math_operations').append($img1, $img2, $img3);
}





// player type his answer using game pad buttons
function write_answer(num) {
    let new_text = $('#answer').text() + num;
    $('#answer').text(new_text);
}


// player submit his answer, send it to server
function submit_answer() {
    event.preventDefault();
    let answer = $('#answer').text();
    $('#answer').empty();
    sock.emit('answer_submitted', answer);
    set_game_pad_state('disable');
}












// Socket work
const sock = parent.sock;

var msg_counter = 0;
sock.on('fromServer_toClients_instruction_game', (text) => {
        $('#instruction-top').text(text);
        $('#instruction-modal').text(text);
        show_modal();
        console.log(`${++msg_counter}: ${text}`);
});




sock.on('question', (text) => {
    ask_question(text)
});
// show question got from server to the player
function ask_question(question_string) {
    $('#question').text(question_string);
}



sock.on('fromServer_toClient_updated_stats', (playersStatsArray) => {
    $('#table-stats-body').empty();
    playersStatsArray[0].subFields.forEach((subField,index) => {
        $('<tr>').append( 
            $('<td>').text(subField.operatorHeb),
            $('<td>').text(playersStatsArray[0].subFields[index].correct),      // player
            $('<td>').text(playersStatsArray[1].subFields[index].correct)       // friend
            ).appendTo('#table-stats-body');
    });
});





sock.on('disableOperators', (state) => {
    set_math_operators_state(state)
});
// math operators disabled after player chose, enabled when new round started
function set_math_operators_state(state) {
    if (state === 'disable')
        $('.math_btn').attr('disabled', 'true');
    else
        $('.math_btn').removeAttr('disabled');
}



sock.on('gamePadState', (state) => {
    set_game_pad_state(state)
});
// only enabled after question was asked
function set_game_pad_state(state) {
    if (state === 'disable')
        $('#game_pad button').attr('disabled', 'true');
    else
        $('#game_pad button').removeAttr('disabled');
}

// Modal
function show_modal() {
    $("#modal_choose_child").fadeIn("slow");
    setTimeout(() => {
        $("#modal_choose_child").fadeOut("slow");
    }, 2000);
}

initModal();

function initModal() {
    $("#btn_exit_modal").on('click', () => {
        $("#modal_choose_child").css("display", "none");
    });

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        let modal = document.getElementById("modal_choose_child");
        // if (event.target == modal) {
        modal.style.display = "none";
        // }
    }
}