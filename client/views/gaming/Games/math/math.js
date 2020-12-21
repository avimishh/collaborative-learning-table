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
        $btn.addClass('answerKey w3-button w3-round-xxlarge');
        $btn.click(function () { // append keyText to existing text in answer field
            $('#field-answer').append($(this).text());
        });
        $("#container-answerKeys").append($btn);
        if ([3,7].includes(answerKey)) $("#container-answerKeys").append($("<br>"));
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
            .addClass('operatorsKey w3-button w3-large w3-ripple w3-blue').text(subFieldsSigns[subField])
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

    sock.on('fromServer_toClient_set_operators_state', (state) => {
        setOperatorsState(state)
    });

    sock.on('fromServer_toClient_set_answer_frame_state', (state) => {
        setAnswerContainerState(state)
    });

    sock.on("fromServer_toClient_show_solution_to_players", (isPlayerAnswerCorrect, question) => {
        if (isPlayerAnswerCorrect) {
            showModal("נכון!", 1000);
        } else {
            showModal("טעות", 1000);
        }
        let questionString = questionToString(question);
        setTimeout(() => {
            showSolutionModal( `${childName}, ${questionString}`, "= " + question._correct_Answer, 6000);
        }, 1000);
    });
}

function questionToString(question) {
    let op = '+';
    switch (question._operator) {
        case 'plus':
            op = '+';
            break;
        case 'minus':
            op = '-';
            break;
        case 'multi':
            op = '*';
            break;
        default:
            console.log('DEBUG: error in questionToString()');
    }
    return `${question._oprnd1} ${op} ${question._oprnd2}`;
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
function showModal(text,time = 2000) {
    $('#modal-game-instruction-text').text(text);
    $("#modal-game-instruction").fadeIn("slow");
    setTimeout(() => {
        $("#modal-game-instruction").fadeOut("slow");
    }, time);
}

function hideModal() {
    $('#modal-game-instruction').hide();
}

// Modal Solution
function showSolutionModal(questionString, answerString, time = 5000) {
    $('#modal-game-solution-text').text(questionString);
    setTimeout(() => {
        $('#modal-game-solution-text').fadeIn("slow");
    }, 500);

    $('#modal-game-solution-answer').text(answerString);
    setTimeout(() => {
        $("#modal-game-solution-answer").fadeIn("slow");
    }, 2000);

    $("#modal-game-solution").fadeIn("slow");
    setTimeout(() => {
        $('#modal-game-solution-text').fadeOut("slow");
        $("#modal-game-solution-answer").fadeOut("slow");
        $("#modal-game-solution").fadeOut("slow");
    }, time);
}

function hideSolutionModal() {
    return;
    $('#modal-game-solution').hide();
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