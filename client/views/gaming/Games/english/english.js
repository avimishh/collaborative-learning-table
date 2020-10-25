const sock = parent.sock;
var imagesPath = "./images/";

$(document).ready(function () {
  addSocketEvents();
  initGamePads(); // check
  sock.emit("setStatsObject", localStorage.getItem("statsObject_id"));
  sock.emit("fromClient_toServer_startGame");
  displayNameTitle();
});


function addSocketEvents(){
  var msg_counter = 0;
  sock.on('fromServer_toClients_instruction_game', (text) => {
      $('#instruction-top').text(text);
      show_modal(text);
      console.log(`${++msg_counter}: ${text}`);
  });

  sock.on('fromServer_toClient_show_the_new_question', (question_string) => {
      let pre_question = 'בחר את התמונה שמתמאימה ל: '
      $('#instruction-top').text(pre_question + question_string);
      show_modal(pre_question + question_string);
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

  // sock.on('fromServer_toClient_setOperatorsState', (state) => {
  //     setOperatorsState(state)
  // });

  // sock.on('fromServer_toClient_set_answer_frame_state', (state) => {
  //     setAnswerContainerState(state)
  // });
}


// var words = ['Apple', 'House', 'Dog', 'Sun', 'Ball'];
// var answers = ['תפוח', 'בית', 'כלב', 'שמש', 'כדור'];
var questions = [];

function initGamePads() {
  initWordsPad();
  initAnswersImagesPad();
}

function initWordsPad() {
  $("#cards_div").empty();
  var words_buttons = [];

  for (let i = 0; i < questions.length; i++) {
    let $btn = $("<button>").text(questions[i]._word);
    $btn.addClass("w3-button w3-card w3-ripple w3-yellow w3-hover-red");
    $btn.click(function () {
      $(this).hide();
      sock.emit("fromClient_toServer_player_chose_word", questions[i]);
    });
    words_buttons.push($btn);
  }

  for (let i = 0; i < words_buttons.length; i++) {
    $("#cards_div").append(words_buttons[i]);
    if (i === 2) $("#cards_div").append($("<br>"));
  }
  set_words_pad_state("disable");
}

// Game pad buttons initizalization
function answers_pad_init() {
  $("#answers_div").empty();
  var answers_buttons = [];
  for (let i = 0; i < questions.length; i++) {
    let $btn = $("<button>").text(questions[i]._answer);
    // w3-css style
    $btn.addClass("w3-button w3-card");
    $btn.on("click", function () {
      $(this).hide();
      // console.log('DEBUG: ' + words[i]);
      sock.emit("fromClient_toServer_player_submitted_answer", questions[i]);
      set_answers_pad_state("disable");
    });
    answers_buttons.push($btn);
  }

  for (let i = 0; i < answers_buttons.length; i++) {
    $("#answers_div").append(answers_buttons[i]);
    if (i === 2) $("#answers_div").append($("<br>"));
  }
  set_answers_pad_state("disable");
}

// <input type="image" class="img_answers" src="./images/apple.png">
// Game pad buttons initizalization
function initAnswersImagesPad() {
  $("#answers_div").empty();
  var answers_buttons = [];
  for (let i = 0; i < questions.length; i++) {
    let $btn = $("<input>")
      .attr("type", "image")
      .attr("src", imagesPath + questions[i]._word + ".png");
    // w3-css style w3-button w3-card
    $btn.addClass("img_answers w3-ripple");
    $btn.on("click", function () {
      $(this).hide();
      // console.log('DEBUG: ' + words[i]);
      sock.emit("fromClient_toServer_player_submitted_answer", questions[i]);
      set_answers_pad_state("disable");
    });
    answers_buttons.push($btn);
  }

  for (let i = 0; i < answers_buttons.length; i++) {
    $("#answers_div").append(answers_buttons[i]);
    if (i === 2) $("#answers_div").append($("<br>"));
  }
  set_answers_pad_state("disable");
}

// only enabled after question was asked
function set_answers_pad_state(state) {
  if (state === "disable") {
    $("#answers_div").hide();
    $("#answers_div button").attr("disabled", "true");
  } else {
    $("#answers_div button").removeAttr("disabled");
    $("#answers_div").show();
  }
}

// print messages to player from server
var msg_counter = 0;
const messageEvent = (text) => {
  // $('#message_box').text(`${msg_counter}: ${text}`);
  $("#message_box").text(`${childName} ${text}`);
  // let $new_li = $("<li>").text(`${msg_counter}: ${text}`);
  // $('#events').prepend($new_li);
  msg_counter++;
};
var childName = "";
function displayNameTitle() {
  // let child = JSON.parse(localStorage.getItem('child'));
  // childName = child.firstName;
  // $('#childName').text(`${child.firstName} ${child.lastName}`);
}

// math operators disabled after player chose, enabled when new round started
function set_words_pad_state(state) {
  if (state === "disable") {
    $("#cards_div").hide();
    $("#cards_div button").attr("disabled", "true");
  } else {
    $("#cards_div").show();
    $("#cards_div button").removeAttr("disabled");
  }
}

// updating statistics got from server on stats board
function update_stats(playersStats) {
  console.log(playersStats);
  $("#score td:nth-child(1)").text(playersStats[0].correct); // player
  $("#score td:nth-child(2)").text(playersStats[1].correct); // friend
}

sock.on("message", (text) => {
  messageEvent(text);
});
sock.on("set_questions", (new_questions) => {
  questions = new_questions;
  initGamePads();
});
sock.on("question", (text) => {
  messageEvent(`מה מתאים למילה: ${text} ?`);
});

sock.on("chooseWordScreen", (state) => {
  set_words_pad_state(state);
});

sock.on("stats", (playersStats) => {
  update_stats(playersStats);
});

sock.on("fromServer_toClient_set_answer_frame_state", (state) => {
  set_answers_pad_state(state);
});
