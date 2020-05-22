
// Wait for jQuery to complete load
$(document).ready(function () {
    numbers_pad_init();
    sock.emit('setStatsObject', localStorage.getItem('statsObject_id'));
    // console.log(localStorage.getItem('statsObject_id'));
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

    for (let i = 0; i < 10; i++) {
        $("#numbers_pad").append(numbers_buttons[i]);
        if (i === 4) $("#numbers_pad").append($("<br>"));
    }

    set_game_pad_state('disable');
}


// show question got from server to the player
function ask_question(question_string) {
    $('#question').text(question_string);
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


// updating statistics got from server on stats board
function update_stats(playersStats) {
    $('#plus td:nth-child(2)').text(playersStats[0].plus);    // player
    $('#plus td:nth-child(3)').text(playersStats[1].plus);    // friend

    $('#minus td:nth-child(2)').text(playersStats[0].minus);    // player
    $('#minus td:nth-child(3)').text(playersStats[1].minus);    // friend

    $('#mult td:nth-child(2)').text(playersStats[0].mult);    // player
    $('#mult td:nth-child(3)').text(playersStats[1].mult);    // friend
}


// math operators disabled after player chose, enabled when new round started
function set_math_operators_state(state) {
    if (state === 'disable')
        $('.math_btn').attr('disabled', 'true');
    else
        $('.math_btn').removeAttr('disabled');
}


// only enabled after question was asked
function set_game_pad_state(state) {
    if (state === 'disable')
        $('#game_pad button').attr('disabled', 'true');
    else
        $('#game_pad button').removeAttr('disabled');
}


// print messages to player from server
var msg_counter = 0;
const messageEvent = (text) => {
    let $new_li = $("<li>").text(`${msg_counter}: ${text}`);
    $('#events').prepend($new_li);
    msg_counter++;
};


// math op init
const addButtonListeners = () => {
    ['plus', 'minus', 'mult'].forEach((id) => {
        const button = document.getElementById(id);
        button.addEventListener('click', () => {
            sock.emit('math_op', id);
            // console.log('DEBUG: btn sock emit');
        });
    });
};




// Socket work
const sock = parent.sock;
console.log(sock);
sock.on('message', (text) => {
    messageEvent(text)
});

sock.on('question', (text) => {
    ask_question(text)
});

sock.on('stats', (playersStats) => {
    update_stats(playersStats)
});

sock.on('disableOperators', (state) => {
    set_math_operators_state(state)
});

sock.on('gamePadState', (state) => {
    set_game_pad_state(state)
});


addButtonListeners();