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

var numSquares = 6;
var colors = generatrRandomColors(numSquares);
var squares = $(".square");
var pickedColor = pickColor();
var colorDisplay = document.getElementById("colorDisplay");
var colorDisplayResult = document.getElementById("colorDisplayResult");
colorDisplay.textContent = colorDisplayText();

var h1 = $("h1");
var messageDisplay = $("#message");
var resetButton = document.getElementById("reset");
var easyBtn = $("#easyBtn");
var hardBtn = $("#hardBtn");
var varRandomColor;


for (var i = 0; i < squares.length; i++) {
    // add initial colors to squares
    squares[i].style.background = colors[i];

    // add click Listeners to squares
    squares[i].addEventListener("click", function () {
        // grab color of clicked square
        var clickedColor = this.style.background;
        // compare color to pickedColor
        if (clickedColor === pickedColor) {
            messageDisplay.text("נכון!");
            changeColors(clickedColor);
            h1.css("background", pickedColor);
            resetButton.textContent = "שחק שוב?";

            if (pickedColor != "rgb(" + constColors[0].val + ")" && pickedColor != "rgb(" + constColors[1].val + ")" && pickedColor != "rgb(" + constColors[2].val + ")") {
                colorDisplayResult.textContent = colorDisplayTextResult();
            }
        } else {
            this.style.background = "#232323";
            messageDisplay.text("נסה שוב");
        }
    });
}

easyBtn.on("click", function () {
    hardBtn.removeClass("selected");
    easyBtn.addClass("selected");
    numSquares = 3;
    sock.emit("fromClient_toServer_player_chose_questionWord", "easy");
    colorDisplay.textContent = colorDisplayText();
    colorDisplayResult.textContent = "";

    for (var i = 0; i < squares.length; i++) {
        if (colors[i]) {
            squares[i].style.background = colors[i];
        } else {
            squares[i].style.display = "none";
        }
    }
    resetMessColor();
});

hardBtn.on("click", function () {
    easyBtn.removeClass("selected");
    hardBtn.addClass("selected");
    numSquares = 6;
    sock.emit("fromClient_toServer_player_chose_questionWord", "hard");
    colorDisplay.textContent = colorDisplayText();
    colorDisplayResult.textContent = "";

    for (var i = 0; i < squares.length; i++) {
        squares[i].style.background = colors[i];
        squares[i].style.display = "block";
    }
    resetMessColor();
});

resetButton.addEventListener("click", function () {
    // generate all new colors
    colors = generatrRandomColors(numSquares);
    // peack a new random color from array
    pickedColor = pickColor();
    // change colorDisplay to match pickedColor
    colorDisplay.textContent = colorDisplayText();
    colorDisplayResult.textContent = "";
    // change colors to squares
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.background = colors[i];
    }
    resetMessColor();
});

function resetMessColor() {
    h1.css("background", "steelblue");
    messageDisplay.text("");
    resetButton.textContent = "צבעים חדשים";
    colorDisplay.style.color = "white";
}

function changeColors(color) {
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.background = color;
    }
    if (colorDisplay.textContent == 'אדום + ירוק + כחול') {
        colorDisplay.style.color = "black";
    }
}

function pickColor() {
    var random = Math.floor(Math.random() * colors.length);
    return colors[random];
}

function generatrRandomColors(num) {
    // make an array
    var arr = [];

    // repeat num times
    for (var i = 0; i < num; i++) {
        // check if exist in arr
        varRandomColor = randomColor();

        while (arr.includes(varRandomColor)) {
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




// Multiplayer
const sock = parent.sock;
var questions = [];

$(document).ready(function () {
    addSocketEvents();
    initGameFrames();
    sock.emit("fromClient_toServer_startGame");
    setChildName();
});

function addSocketEvents() {
    var msg_counter = 0;
    sock.on('fromServer_toClients_instruction_game', (text) => {
        // $('#instruction-top').text(`${childName}, ${text}`);
        showModal(`${childName}, ${text}`);
        console.log(`${++msg_counter}: ${text}`);
    });

    sock.on('fromServer_toClient_show_the_new_question', (question) => {
        // console.log(question_string);
        colors = generatrRandomColors(numSquares);
        let correctAnswerConstColor = constColors.find(c => c.name === question._objectColor);
        let correctAnswerVal = correctAnswerConstColor.val;
        let correctAnswerIndex = Math.floor( Math.random() * colors.length);
        colors[correctAnswerIndex] = `rgb(${correctAnswerVal})`
        
        // pickedColor = question._objectNameEng;
        pickedColor = correctAnswerConstColor;

        let pre_question = `${childName}, ` + 'איזה צבע אני? '
        $('#instruction-top').text(pre_question + question_string);
        showModal(pre_question + question_string);
        $('#img-question').attr('src', './pics/' + question._objectNameEng + '.png');
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
}

function initGameFrames() {
    // initQuestionsWordsFrame();
    initAnswersImagesFrame();
}

// change to choose operator-level of question
function initQuestionsWordsFrame() {
    $("#div-questions").empty();

    questions.forEach(question => {
        let $btn = $("<button>").text(question._word);
        $btn.addClass("w3-button w3-card w3-ripple w3-yellow w3-hover-red");
        $btn.click(function () {
            $(this).hide();
            sock.emit("fromClient_toServer_player_chose_questionWord", question);
        });
        $("#div-questions").append($btn);
    });

    set_questions_frame_state("disable");
}

function initAnswersImagesFrame() {

    set_answers_frame_state("disable");
}

function set_answers_frame_state(state) {
    if (state === "disable") {
        $("#div-answers").hide();
        $("#div-answers button").attr("disabled", "true");
    } else { // only enabled after question was asked
        $("#div-answers button").removeAttr("disabled");
        $("#div-answers").show();
    }
}

function set_operators_frame_state(state) {
    // math operators disabled after player chose, enabled when new round started
    if (state === "disable") {
        $("#div-operators").hide();
        $("#div-operators button").attr("disabled", "true");
    } else {
        $("#div-operators").show();
        $("#div-operators button").removeAttr("disabled");
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
  
  function hideModal() {
    $('#modal-game-instruction').hide();
  }
  
  var childName = "";
  function setChildName() {
    let child = JSON.parse(localStorage.getItem('child'));
    childName = child.firstName;
  }