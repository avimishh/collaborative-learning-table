const sock = parent.sock;
const imagesPath = "./images/";
var questions = [];
var arrQuestions = [];
var chooseQuestions = null;
var isFirst = true;

$(document).ready(function () {
    addSocketEvents();
    // initGameFrames(); // check
    sock.emit("fromClient_toServer_startGame");
    setChildName();
});


function addSocketEvents() {
    var msg_counter = 0;
    sock.on('fromServer_toClients_instruction_game', (text) => {
        $('#instruction-top').text(`${childName}, ${text}`);
        showModal(`${childName}, ${text}`, 'NoName');
        console.log(`${++msg_counter}: ${text}`);
    });

    sock.on('fromServer_toClient_show_the_new_question', (question_string) => {
        console.log(question_string);

        let pre_question = `${childName}, ` + 'בחר את המילה שמתאימה לתמונה: '
        $('#instruction-top').text(pre_question);
        $('#img-question').attr('src', './images/' + question_string.toLowerCase() + '.png').show();
        showModal(pre_question, question_string.toLowerCase());

        chooseQuestions = question_string;
        initAnswersWordsFrame(question_string);
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

    sock.on("fromServer_toClient_set_question_frame_state", (state) => {
        set_questions_frame_state(state);
        console.log(state);
    });

    sock.on("fromServer_toClient_set_answer_frame_state", (state) => {
        set_answers_frame_state(state);
        console.log(state);
    });

    sock.on("fromServer_toClient_send_questions_collection", (new_questions) => {
        questions = new_questions;
        console.log("== 57 ==");
        console.log(questions);

        // initGameFrames();

        chooseQuestions = initQuestionsImagesFrame();
        // initAnswersWordsFrame(chooseQuestions);
    });

    sock.on("fromServer_toClient_show_solution_to_players", (isPlayerAnswerCorrect, question) => {
        if (isPlayerAnswerCorrect) {
            showModal("נכון!");
        } else {
            showModal("טעות");
        }

        let questionString = question._word;
        setTimeout(() => {
            showSolutionModal(question._word.toLowerCase(), question._answer, 6000);
        }, 1000);
    });
}


function initGameFrames() {
    chooseQuestions = initQuestionsImagesFrame();
    initAnswersWordsFrame(chooseQuestions);
}

function initQuestionsImagesFrame() {
    $('#img-question').hide();
    $("#div-questions").empty();

    questions.forEach(question => {
        let $btn = $("<input>", {
            "type": "image",
            "src": imagesPath + question._word.toLowerCase() + ".png"
        });
        $btn.addClass("img_answers w3-ripple");

        $btn.click(function () {
            $(this).hide();
            sock.emit("fromClient_toServer_player_chose_questionWord", question);
            chooseQuestions = question._word;
            console.log("=====>" + chooseQuestions);

            if (isFirst) {
                isFirst = false;
                // $("#div-questions").append($btn);
                // set_questions_frame_state("disable");

                // initAnswersWordsFrame();
                return chooseQuestions;
            }
        });
        $("#div-questions").append($btn);
    });

    set_questions_frame_state("disable");
    return chooseQuestions;
}

function initAnswersWordsFrame(chooseQuestions) {
    // $('#img-question').hide();
    $("#div-answers").empty();

    questions.forEach(question => {

        console.log("---->" + chooseQuestions);
        for (var i = 0; i < question._wrongAnswers.length; i++) {
            let $btn = $("<button>").text(question._wrongAnswers[i]);
            $btn.addClass("w3-button img_answers_card w3-card w3-ripple w3-yellow w3-hover-red");
            console.log(question._wrongAnswers[i]);

            $btn.on("click", function () {
                console.log("11111111111333");
                console.log($btn.text());
                $(this).hide();
                sock.emit("fromClient_toServer_player_submitted_answer", {
                    ques: question._answer,
                    ans: $btn.text()
                }, question);
                set_answers_frame_state("disable");
            });

            if (question._word == chooseQuestions) {
                // $("#div-answers").append($btn);
                shuffleCards(arrQuestions, $btn, question._wrongAnswers.length);
            }
        }
    });

    for (var i = 0; i < arrQuestions.length; i++) {
        $("#div-answers").append(arrQuestions[i]);
    }
    arrQuestions = [];
    set_answers_frame_state("disable");
}

// shuffle cards
function shuffleCards(arrQuestions, cardsBtn, place) { // Fisher-Yates Shuffle Algorithm.

    let randIndex = Math.floor(Math.random() * (place + 1));
    while (arrQuestions[randIndex]) {
        randIndex = Math.floor(Math.random() * (place + 1));
    }
    arrQuestions[randIndex] = cardsBtn;
}

function set_answers_frame_state(state) {
    if (state === "disable") {
        $("#div-answers").hide();
        $("#div-answers button").attr("disabled", "true");
    } else { // only enabled after question was asked
        $("#div-answers button").removeAttr("disabled");
        console.log($("#div-answers"));

        $("#div-answers").show();
    }
}

function set_questions_frame_state(state) {
    // math operators disabled after player chose, enabled when new round started
    if (state === "disable") {
        $("#div-questions").hide();
        $("#div-questions button").attr("disabled", "true");
    } else {
        $("#div-questions").show();
        $("#div-questions button").removeAttr("disabled");
    }
}


// Modal
function showModal(text, imageName = 'NoName') {
    $('#modal-game-instruction-text').text(text);
    if (imageName == 'NoName') {
        $('#modal-game-instruction-img').css('display', 'none');
    } else {
        $('#modal-game-instruction-img').attr('src', './images/' + imageName + '.png').show();
    }

    $("#modal-game-instruction").fadeIn("slow");
    setTimeout(() => {
        $("#modal-game-instruction").fadeOut("slow");
    }, 2000);
}

function hideModal() {
    $('#modal-game-instruction').hide();
}

// Modal Solution
function showSolutionModal(questionImageName, answer, time = 5000) {
    $('#img-solution').attr('src', './images/' + questionImageName + '.png');

    setTimeout(() => {
        $('#img-solution').fadeIn("slow");
        $('#modal-game-solution-text').fadeIn("slow");
    }, 500);

    setTimeout(() => {
        $('#modal-game-solution-text2').fadeIn("slow");
    }, 1000);

    $('#modal-game-solution-answer').text(answer);
    setTimeout(() => {
        $("#modal-game-solution-answer").fadeIn("slow");
    }, 2000);

    $("#modal-game-solution").fadeIn("slow");
    setTimeout(() => {
        $('#img-solution').fadeOut("slow");
        $('#modal-game-solution-text').fadeOut("slow");
        $('#modal-game-solution-text2').fadeOut("slow");
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
}