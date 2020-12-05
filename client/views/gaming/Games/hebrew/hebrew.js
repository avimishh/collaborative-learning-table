const sock = parent.sock;
const imagesPath = "./images/";
var questions = [];

$(document).ready(function () {
    addSocketEvents();
    initGameFrames(); // check
    sock.emit("fromClient_toServer_startGame");
    setChildName();
});


function addSocketEvents() {
    var msg_counter = 0;
    sock.on('fromServer_toClients_instruction_game', (text) => {
        $('#instruction-top').text(`${childName}, ${text}`);
        showModal(`${childName}, ${text}`,'NoName');
        console.log(`${++msg_counter}: ${text}`);
    });

    sock.on('fromServer_toClient_show_the_new_question', (question_string) => {
        console.log(question_string);
        let pre_question = `${childName}, ` + 'בחר את המילה שמתאימה לתמונה: '
        $('#instruction-top').text(pre_question);
        $('#img-question').attr('src', './images/' + question_string.toLowerCase() + '.png').show();
        showModal(pre_question, question_string.toLowerCase());

        // $('#instruction-top').text(pre_question + question_string);
        // showModal(pre_question + question_string);
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
    initQuestionsWordsFrame();
    initAnswersImagesFrame();
}

function initQuestionsWordsFrame() {
    $('#img-question').hide();
    $("#div-questions").empty();

    questions.forEach(question => {
        let $btn = $("<input>", {
            "type": "image",
            "src": imagesPath + question._word + ".png"
        });
        $btn.addClass("img_answers w3-ripple");

        // let $btn = $("<button>").text(question._word);
        // $btn.addClass("w3-button w3-card w3-ripple w3-yellow w3-hover-red");
        $btn.click(function () {
            $(this).hide();
            sock.emit("fromClient_toServer_player_chose_questionWord", question);
        });
        $("#div-questions").append($btn);
    });

    set_questions_frame_state("disable");
}

function initAnswersImagesFrame() {
    $('#img-question').hide();
    $("#div-answers").empty();

    questions.forEach(question => {
        let $btn = $("<button>").text(question._word);
        $btn.addClass("w3-button img_answers w3-card w3-ripple w3-yellow w3-hover-red");
        console.log(question);
        // let $btn = $("<input>", {
        //     "type": "image",
        //     "src": imagesPath + question._word + ".png"
        // });
        // $btn.addClass("img_answers w3-ripple");
        $btn.on("click", function () {
            $(this).hide();
            sock.emit("fromClient_toServer_player_submitted_answer", question);
            set_answers_frame_state("disable");
        });
        $("#div-answers").append($btn);
    });

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
function showModal(text, imageName) {
    $('#modal-game-instruction-text').text(text);
    if(imageName == 'NoName'){
        $('#modal-game-instruction-img').css('display', 'none');
    }
    else{
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

var childName = "";

function setChildName() {
    let child = JSON.parse(localStorage.getItem('child'));
    childName = child.firstName;
}
