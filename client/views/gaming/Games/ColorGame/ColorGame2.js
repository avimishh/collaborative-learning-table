let constColors = [{
    'name': 'אדום', // constColors[0]
    'val': '255, 0, 0',
    'result': 'אדום'
}, {
    'name': 'ירוק', // constColors[1]
    'val': '0, 255, 0',
    'result': 'ירוק'
}, {
    'name': 'כחול', // constColors[2]
    'val': '0, 0, 255',
    'result': 'כחול'
}, {
    'name': 'תכלת', // constColors[3]
    'val': '0, 255, 255',
    'result': 'ירוק + כחול'
}, {
    'name': 'צהוב', // constColors[4]
    'val': '255, 255, 0',
    'result': 'אדום + ירוק'
}, {
    'name': 'אפור', // constColors[5]
    'val': '128, 128, 128',
    'result': 'שחור + לבן'
}, {
    'name': 'לבן', // constColors[6]
    'val': '255, 255, 255',
    'result': 'אדום + ירוק + כחול'
}, {
    'name': 'סגול', // constColors[7]
    'val': '139, 0, 139',
    'result': 'אדום + כחול'
}, {
    'name': 'כתום', // constColors[8]
    'val': '255, 165, 0',
    'result': 'צהוב + אדום'
}, {
    'name': 'חום', // constColors[9]
    'val': '139, 69, 19',
    'result': 'כתום + שחור'
}, {
    'name': 'ורוד', // constColors[10]
    'val': '255, 182, 193',
    'result': 'לבן + אדום'
}, {
    'name': 'ירוק כהה', // constColors[11]
    'val': '25, 89, 5',
    'result': 'כחול + ירוק'
}];

var colors, numSquares = 6,
    pickedColor, h1, colorSquares;

// Multiplayer
const sock = parent.sock;
var questions = [];

$(document).ready(function () {
    addSocketEvents();
    initialSetup();
    initOperatorButtons();
    initGameFrames();
    sock.emit("fromClient_toServer_startGame");
    setChildName();
});


function initOperatorButtons() {
    $("#easyBtn").on("click", function () {
        $("#hardBtn").removeClass("selected");
        $("#easyBtn").addClass("selected");
        sock.emit("fromClient_toServer_player_chose_operator", "easy");
    });

    $("#hardBtn").on("click", function () {
        $("#easyBtn").removeClass("selected");
        $("#hardBtn").addClass("selected");
        sock.emit("fromClient_toServer_player_chose_operator", "hard");
    });
}

function initialSetup() { // can remove
    colorSquares = $(".square");
    h1 = $("h1");
    colors = generateRandomColors(numSquares);
    for (var i = 0; i < colorSquares.length; i++) {
        // add initial colors to colorSquares
        colorSquares.eq(i).css('background', colors[i]);
        // colorSquares[i].style.background = colors[i];
        colorSquares.eq(i).click(function () {
            let clickedColor = colorValToName($(this).css('backgroundColor')); // this.style.background;
            console.log(clickedColor);
            sock.emit('fromClient_toServer_player_submitted_answer', clickedColor);
            $(this).hide();
            set_answers_frame_state('disable');
            showModal('המתן לחברך');
        });
    }
}


function resetMessColor() {
    h1.css("background", "steelblue");
    $('#colorDisplay').css('color', 'white');
}

function changeColors(color) {
    for (var i = 0; i < colorSquares.length; i++) {
        colorSquares[i].style.background = color;
    }
}

function pickColor() {
    var random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

function generateRandomColors(num, correctAnswerConstColor) {
    // make an array
    var arr = [];
    var varRandomColor;

    // repeat num times
    for (var i = 0; i < num; i++) {
        // check if exist in arr
        varRandomColor = randomColor();

        while (arr.includes(varRandomColor) || varRandomColor === "rgb(" + correctAnswerConstColor.val + ")") {
            varRandomColor = randomColor();
        }
        // add num random colors to array
        arr.push(varRandomColor);
    }

    // return that array
    return arr;
}

function randomColor() {
    // peack a color from 0 - 11
    var index = Math.floor(Math.random() * 12);
    return "rgb(" + constColors[index].val + ")";
}


function colorValToName(colorVal) {
    var title;

    switch (colorVal) {
        case "rgb(" + constColors[0].val + ")":
            title = constColors[0].name;
            break;
        case "rgb(" + constColors[1].val + ")":
            title = constColors[1].name;
            break;
        case "rgb(" + constColors[2].val + ")":
            title = constColors[2].name;
            break;
        case "rgb(" + constColors[3].val + ")":
            title = constColors[3].name;
            break;
        case "rgb(" + constColors[4].val + ")":
            title = constColors[4].name;
            break;
        case "rgb(" + constColors[5].val + ")":
            title = constColors[5].name;
            break;
        case "rgb(" + constColors[6].val + ")":
            title = constColors[6].name;
            break;
        case "rgb(" + constColors[7].val + ")":
            title = constColors[7].name;
            break;
        case "rgb(" + constColors[8].val + ")":
            title = constColors[8].name;
            break;
        case "rgb(" + constColors[9].val + ")":
            title = constColors[9].name;
            break;
        case "rgb(" + constColors[10].val + ")":
            title = constColors[10].name;
            break;
        case "rgb(" + constColors[11].val + ")":
            title = constColors[11].name;
            break;
    }
    return title;
}

function colorDisplayText() {
    var title;

    switch (pickedColor) {
        case "rgb(" + constColors[0].val + ")":
            title = constColors[0].result;
            break;
        case "rgb(" + constColors[1].val + ")":
            title = constColors[1].result;
            break;
        case "rgb(" + constColors[2].val + ")":
            title = constColors[2].result;
            break;
        case "rgb(" + constColors[3].val + ")":
            title = constColors[3].result;
            break;
        case "rgb(" + constColors[4].val + ")":
            title = constColors[4].result;
            break;
        case "rgb(" + constColors[5].val + ")":
            title = constColors[5].result;
            break;
        case "rgb(" + constColors[6].val + ")":
            title = constColors[6].result;
            break;
        case "rgb(" + constColors[7].val + ")":
            title = constColors[7].result;
            break;
        case "rgb(" + constColors[8].val + ")":
            title = constColors[8].result;
            break;
        case "rgb(" + constColors[9].val + ")":
            title = constColors[9].result;
            break;
        case "rgb(" + constColors[10].val + ")":
            title = constColors[10].result;
            break;
        case "rgb(" + constColors[11].val + ")":
            title = constColors[11].result;
            break;
    }
    return title;
}

function colorDisplayTextResult() {
    var titleResult;

    switch (pickedColor) {
        case "rgb(" + constColors[0].val + ")":
            titleResult = " = " + constColors[0].name;
            break;
        case "rgb(" + constColors[1].val + ")":
            titleResult = " = " + constColors[1].name;
            break;
        case "rgb(" + constColors[2].val + ")":
            titleResult = " = " + constColors[2].name;
            break;
        case "rgb(" + constColors[3].val + ")":
            titleResult = " = " + constColors[3].name;
            break;
        case "rgb(" + constColors[4].val + ")":
            titleResult = " = " + constColors[4].name;
            break;
        case "rgb(" + constColors[5].val + ")":
            titleResult = " = " + constColors[5].name;
            break;
        case "rgb(" + constColors[6].val + ")":
            titleResult = " = " + constColors[6].name;
            break;
        case "rgb(" + constColors[7].val + ")":
            titleResult = " = " + constColors[7].name;
            break;
        case "rgb(" + constColors[8].val + ")":
            titleResult = " = " + constColors[8].name;
            break;
        case "rgb(" + constColors[9].val + ")":
            titleResult = " = " + constColors[9].name;
            break;
        case "rgb(" + constColors[10].val + ")":
            titleResult = " = " + constColors[10].name;
            break;
        case "rgb(" + constColors[11].val + ")":
            titleResult = " = " + constColors[11].name;
            break;
    }

    return titleResult;

}


function addSocketEvents() {
    var msg_counter = 0;
    sock.on('fromServer_toClients_instruction_game', (text) => {
        showModal(`${childName}, ${text}`);
        console.log(`${++msg_counter}: ${text}`);
    });

    sock.on('fromServer_toClient_show_the_new_question', (operator, question) => {
        if (operator === "easy")
            numSquares = 3;
        else if (operator === "hard")
            numSquares = 6;

        let correctAnswerConstColor = constColors.find(c => c.name === question._objectColor);
        console.log(correctAnswerConstColor);
        colors = generateRandomColors(numSquares, correctAnswerConstColor);

        let correctAnswerVal = correctAnswerConstColor.val;
        let correctAnswerIndex = Math.floor(Math.random() * colors.length);
        colors[correctAnswerIndex] = `rgb(${correctAnswerVal})`

        // pickedColor = question._objectNameEng;
        pickedColor = correctAnswerConstColor;
        // $('#colorDisplay').text(colorDisplayText());

        let question_string = colorDisplayText();
        console.log(colorDisplayText());

        let pre_question = `${childName}, ` + 'איזה צבע אני? '
        $('#instruction-top').text(pre_question);
        showModal(pre_question);
        $('#img-question').attr('src', '../images/' + question._objectNameEng + '.png').show();

        for (var i = 0; i < colorSquares.length; i++) {
            if (colors[i]) {
                colorSquares[i].style.display = "block";
                colorSquares[i].style.background = colors[i];
            } else {
                colorSquares[i].style.display = "none";
            }
        }

        resetMessColor();
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

    sock.on("fromServer_toClient_set_operators_state", (state) => {
        set_operators_frame_state(state);
    });

    sock.on("fromServer_toClient_set_answer_frame_state", (state) => {
        set_answers_frame_state(state);
    });

    sock.on("fromServer_toClient_send_questions_collection", (new_questions) => {
        questions = new_questions;
        initGameFrames();
    });

    sock.on("fromServer_toClient_show_solution_to_players", (isPlayerAnswerCorrect, solution) => {
        if (isPlayerAnswerCorrect) {
            showModal("נכון!");
        } else {
            // this.style.background = "#232323";
            showModal("נסה שוב");
        }
        // show solution
        changeColors(pickedColor);
        h1.css("background", pickedColor);

        $('#colorDisplayResult').text(colorDisplayTextResult());

        // resetButton.textContent = "שחק שוב?";
    });
}

function initGameFrames() {
    set_answers_frame_state("disable");
}

function set_answers_frame_state(state) {
    if (state === 'disable') // operators disabled after player chose
        $('#container').children().attr('disabled', 'true');
    else // enabled when new round started
        $('#container').children().removeAttr('disabled');
}

function set_operators_frame_state(state) {
    // operators disabled after player chose, enabled when new round started
    if (state === "disable") {
        hideModal('modal-game-operator');
    } else {
        showOperatorModal();
    }
}


// Modal
function showModal(text) {
    $('#modal-game-instruction-text').text(text);
    $("#modal-game-instruction").fadeIn("slow");
    setTimeout(() => {
        $("#modal-game-instruction").fadeOut("slow");
    }, 2000);
}

// Modal
function showOperatorModal(text) {
    // $('#modal-game-operator-text').text(text);
    $("#modal-game-operator").fadeIn("slow");
}

function hideModal(modalType) {
    $(`#${modalType}`).hide();
}

var childName = "";

function setChildName() {
    let child = JSON.parse(localStorage.getItem('child'));
    childName = child.firstName;
}