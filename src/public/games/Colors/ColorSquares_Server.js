const save_Data_DB = require('../StatsSaver');
const {
    Player
} = require('../models/player');
const {
    Game
} = require('../models/game');
const {
    Stats
} = require('../models/stats');

// @@@@CHANGING
const field = 'colors';
const subFields = [{
    eng: 'objectColorToColor',
    heb: 'התאמת צבע לתמונה'
}];

const MAX_ROUNDS = 1;
var questions = [];
var potentialQuestionsCollection = [];
const P0 = 0,
    P1 = 1;
// @@@@


module.exports = class ColorsGame { // @@@@CHANGING
    constructor(player0, player1, game) {
        this._game_id = game.id;

        this._players = [player0, player1];
        this._players.forEach(p => p.set_Player_Stat(new Stats(field, subFields)));

        this._sendToPlayers('fromServer_toClients_instruction_game', 'המשחק החל');
        this._generate_questions(); //@@

        // #### Specific Listeners ####
        // Add listeners
        this._players.forEach((player, idx) => {
            // after player chose operator create new question
            player.socket.on('fromClient_toServer_player_chose_operator', (operator) => { // @@@@CHANGING
                this._askNewQuestion(idx, operator);
            });

            player.socket.on('fromClient_toServer_player_submitted_answer', (answer) => {
                this._checkPlayerAnswer(idx, answer);
                this._checkRoundOver();
            });
        });
        // ############################

        this._sendToPlayers('fromServer_toClient_send_questions_collection', potentialQuestionsCollection);
        this._isPlayersAnswerCorrect = [null, null];
        this._roundCounter = 0;
        this._whoseTurn = P0; // By default player0 starts
        this._update_Clients_Stats(); // first initialize all to 0
        this._startNextRound();
    }

    // Message to 1 player
    _sendToPlayer(playerIndex, type, param) {
        this._players[playerIndex].send_Message_To_Client(type, param);
    }

    // Message for both players
    _sendToPlayers(type, param) {
        this._players.forEach((player) => {
            player.send_Message_To_Client(type, param)
        });
    }

    _startNextRound() {
        this._sendToPlayers('fromServer_toClient_send_questions_collection', potentialQuestionsCollection);
        this._isPlayersAnswerCorrect = [null, null];
        this._roundCounter++;
        this._determineTurn();
    }

    // @@@@CHANGING
    _determineTurn() {
        let playerToPlay = this._players[this._whoseTurn];
        playerToPlay.send_Message_To_Client('fromServer_toClients_instruction_game', 'תורך לבחור פעולה');
        playerToPlay.set_Operators_Frame_State('enable');

        let playerToWait = this._players[(this._whoseTurn === P1) ? P0 : P1];
        playerToWait.send_Message_To_Client('fromServer_toClients_instruction_game', 'המתן לחברך בבחירת פעולה');
        playerToWait.set_Operators_Frame_State('disable');
    }

    _set_Next_Player_Turn() {
        this._whoseTurn = (this._whoseTurn === P1) ? P0 : P1;
    }

    // @@@@CHANGING
    _setPlayersAnswerFrameState(state) {
        this._sendToPlayers('fromServer_toClient_set_answer_frame_state', state)
    }

    // @@@@CHANGING
    _askNewQuestion(playerIndex, questionLevel) {
        // After player chose operator/question disable his game operators
        this._players[playerIndex].set_Operators_Frame_State('disable');
        // Remove question from potential collection
        let qIdx = Math.floor( Math.random() * potentialQuestionsCollection.length );
        if (qIdx !== -1) questions.push(potentialQuestionsCollection.splice(qIdx, 1)[0]);
        // console.log(questions[questions.length - 1]);
        this._players.forEach(p => p.show_Client_New_Question(questionLevel, questions[questions.length - 1]));
        this._players.forEach(p => p.stats._add_AskedQuestion(questions[questions.length - 1]._operator));

        this._setPlayersAnswerFrameState('enable'); // set enable so player can answer
    }



    _checkPlayerAnswer(playerIndex, answer_From_Player) {
        let asked_Question = questions[questions.length - 1];
        if (asked_Question._objectColor === answer_From_Player) { // @@@@CHANGING
            this._players[playerIndex].stats._add_CorrectAnswer(asked_Question._operator);
            this._isPlayersAnswerCorrect[playerIndex] = true;
        } else // if wrong answer
            this._isPlayersAnswerCorrect[playerIndex] = false;
        // console.log(this._isPlayersAnswerCorrect);
    }

    _checkRoundOver() { // check round over after every answer one of the player made
        let is_Round_End = true;
        this._isPlayersAnswerCorrect.forEach((a) => {
            if (a === null) is_Round_End = false;
        });
        if (is_Round_End === false) return;

        this._endRound();
    }

    _showToPlayersSolution(){
        this._players[P0].send_Solution_To_Client(this._isPlayersAnswerCorrect[P0], '');
        this._players[P1].send_Solution_To_Client(this._isPlayersAnswerCorrect[P1], '');
    }

    _endRound() {
        this._update_Clients_Stats();
        this._showToPlayersSolution();

        if (this._roundCounter >= MAX_ROUNDS) {
            this._roundCounter = 0;
            this._sendToPlayers('fromServer_toClients_instruction_game', 'המשחק הסתיים');
            this._save_Stats_in_DB();
            setTimeout(() => {
                this._end_Game_Back_To_Games_Gallery()
            }, 5000);
            return;
        }

        this._set_Next_Player_Turn();
        setTimeout(() => {
            this._startNextRound()
        }, 2000);
    }

    _update_Clients_Stats() {
        this._players[P0].update_Client_Stats([this._players[P0].stats, this._players[P1].stats]);
        this._players[P1].update_Client_Stats([this._players[P1].stats, this._players[P0].stats]);
    }

    _save_Stats_in_DB() {
        this._players.forEach(async (p) => {
            await save_Data_DB(p.id, p.stats, this._game_id);
        });
    }

    _end_Game_Back_To_Games_Gallery() {
        this._removeListeners();
        this._sendToPlayers('fromServer_toClient_players_ready_hostPlayer_choose_game');
    }

    // @@@@CHANGING
    _removeListeners() {
        this._players.forEach(p => {
            p.socket.removeAllListeners('fromClient_toServer_player_chose_operator');
            p.socket.removeAllListeners('fromClient_toServer_player_submitted_answer');
            // console.log(p.socket.eventNames());
        });
    }

    // @@@@CHANGING
    _generate_questions() {
        var generatedQuestions = [{
            objectColor: "אדום",
            objectNameHeb: "תפוח",
            objectNameEng: "Apple",
        }, {
            objectColor: "צהוב",
            objectNameHeb: "שמש",
            objectNameEng: "Sun",
        }, {
            objectColor: "תכלת",
            objectNameHeb: "ים",
            objectNameEng: "Sea",
        }, {
            objectColor: "ירוק",
            objectNameHeb: "צפרדע",
            objectNameEng: "Frog",
        }, {
            objectColor: "צהוב",
            objectNameHeb: "גבינה",
            objectNameEng: "Cheese",
        }, {
            objectColor: "לבן",
            objectNameHeb: "ענן",
            objectNameEng: "Cloud",
        }, {
            objectColor: "כחול",
            objectNameHeb: "דולפין",
            objectNameEng: "Dolphin",
        }, {
            objectColor: "ירוק",
            objectNameHeb: "דשא",
            objectNameEng: "Grass",
        }, {
            objectColor: "חום",
            objectNameHeb: "דוב",
            objectNameEng: "Bear",
        }, {
            objectColor: "כתום",
            objectNameHeb: "תפוז",
            objectNameEng: "Orange",
        }, {
            objectColor: "כתום",
            objectNameHeb: "חתול",
            objectNameEng: "Cat",
        }, {
            objectColor: "חום",
            objectNameHeb: "כובע",
            objectNameEng: "Hat",
        }, {
            objectColor: "סגול",
            objectNameHeb: "ענבים",
            objectNameEng: "Grapes",
        }];

        generatedQuestions.forEach(q => {
            potentialQuestionsCollection.push(new Question(q.objectColor, q.objectNameHeb, q.objectNameEng));
        });
    }
}


// @@@@CHANGING
// #### specific ####
class Question {
    constructor(objectColor, objectNameHeb, objectNameEng, operator = subFields[0].eng) {
        this._objectColor = objectColor;
        this._objectNameHeb = objectNameHeb;
        this._objectNameEng = objectNameEng;
        this._operator = operator;
    }
}