const sock = parent.sock;

$(document).ready(function () {
    addSocketEvents();
    addAnswerKeys();
    addSubFieldsOperators();
    sock.emit('fromClient_toServer_startGame');
    setChildName();
});


function addAnswerKeys() {
    var answerkeys = [];
    for (let i = 1; i < 10; i++) {
        answerkeys.push(i);
    }
    answerkeys.push(0);

    answerkeys.forEach(answerKey => {
        let $btn = $("<button>").text(answerKey);
        $btn.addClass('w3-button w3-round-xxlarge');
        $btn.click(function () { // append keyText to existing text in answer field
            $('#field-answer').append($(this).text());
        });
        $("#container-answerKeys").append($btn);
        if ((answerKey % 3) === 0) $("#container-answerKeys").append($("<br>"));
    });

    setAnswerContainerState('disable');
}

function addSubFieldsOperators() {
    var subFields = ['plus', 'minus', 'multi'];
    var subFieldsSigns = {
        'plus': '+',
        'minus': '-',
        'multi': 'X'
    };

    subFields.forEach(subField => {
        $('<button>', {
                'id': `operator-${subField}`
            })
            .addClass('w3-button w3-large w3-ripple w3-blue').text(subFieldsSigns[subField])
            .appendTo('#operators-subFields')
            .click(() => {
                sock.emit('fromClient_toServer_notify_subField_selected', subField)
            });
    });
}

function submitAnswer() {
    // event.preventDefault();
    let answer = $('#field-answer').text();
    $('#field-answer').empty();
    sock.emit('fromClient_toServer_player_submitted_answer', answer);
    setAnswerContainerState('disable');
}


function addSocketEvents(){
    var msg_counter = 0;
    sock.on('fromServer_toClients_instruction_game', (text) => {
        $('#instruction-top').text(`${childName}, ${text}`);
        showModal(`${childName}, ${text}`);
        console.log(`${++msg_counter}: ${text}`);
    });

    sock.on('fromServer_toClient_show_the_new_question', (question_string) => {
        let pre_question = `${childName}, ` + 'פתור את התרגיל: '
        $('#instruction-top').text(pre_question + question_string);
        showModal(pre_question + question_string);
    });

    sock.on('fromServer_toClient_updated_stats', (playersStatsArray) => {
        $('#table-stats-body').empty();
        playersStatsArray[0].subFields.forEach((subField, index) => {
            $('<tr>').append(
                $('<td>').text(subField.operatorHeb),
                $('<td>').text(playersStatsArray[0].subFields[index].correct), // player
                $('<td>').text(playersStatsArray[1].subFields[index].correct) // friend
            ).appendTo('#table-stats-body');
        });
    });

    sock.on('fromServer_toClient_setOperatorsState', (state) => {
        setOperatorsState(state)
    });

    sock.on('fromServer_toClient_set_answer_frame_state', (state) => {
        setAnswerContainerState(state)
    });
}


function setOperatorsState(state) {
    if (state === 'disable') // operators disabled after player chose
        $('#operators-subFields').children().attr('disabled', 'true');
    else // enabled when new round started
        $('#operators-subFields').children().removeAttr('disabled');
}

function setAnswerContainerState(state) {
    if (state === 'disable')
        $('#frame-answer button').attr('disabled', 'true');
    else // only enabled after question was asked
        $('#frame-answer button').removeAttr('disabled');
}

// Modal
function showModal(text) {
    $('#modal-game-instruction-text').text(text);
    $("#modal-game-instruction").fadeIn("slow");
    setTimeout(() => {
        $("#modal-game-instruction").fadeOut("slow");
    }, 2000);
}

function hideModal() {
    $('#modal-game-instruction').hide();
}

var childName = "";
function setChildName() {
  let child = JSON.parse(localStorage.getItem('child'));
  childName = child.firstName;
  // $('#childName').text(`${child.firstName}`);
}

// function setMathOperators() {
//     let $img1 = $('<img>').attr('src', './plus.png').addClass('img_op');
//     let $img2 = $('<img>').attr('src', './minus.png').addClass('img_op');
//     let $img3 = $('<img>').attr('src', './multi.png').addClass('img_op');

//     $('#math_operations').append($img1, $img2, $img3);
// }