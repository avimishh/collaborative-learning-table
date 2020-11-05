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
const field = 'english';
const subFields = [{
    eng: 'wordMatchToPicture',
    heb: 'התאמת מילה לתמונה'
}];

const MAX_ROUNDS = 3;
var questions = [];
var potentialQuestionsCollection = [];
const P0 = 0,
    P1 = 1;
// @@@@


class EnglishGame { // @@@@CHANGING
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
            player.socket.on('fromClient_toServer_player_chose_questionWord', (question) => { // @@@@CHANGING
                this._askNewQuestion(idx, question);
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
    _sendToPlayer(playerIndex, type, msg) {
        this._players[playerIndex].send_Message_To_Client(type, msg);
    }

    // Message for both players
    _sendToPlayers(type, msg) {
        this._players.forEach((player) => {
            player.send_Message_To_Client(type, msg)
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
        playerToPlay.set_Questions_Frame_State('enable');

        let playerToWait = this._players[(this._whoseTurn === P1) ? P0 : P1];
        playerToWait.send_Message_To_Client('fromServer_toClients_instruction_game', 'המתן לחברך בבחירת פעולה');
        playerToWait.set_Questions_Frame_State('disable');
    }

    _set_Next_Player_Turn() {
        this._whoseTurn = (this._whoseTurn === P1) ? P0 : P1;
    }

    // @@@@CHANGING
    _setPlayersAnswerFrameState(state) {
        this._sendToPlayers('fromServer_toClient_set_answer_frame_state', state)
    }

    // @@@@CHANGING
    _askNewQuestion(playerIndex, question) {
        // After player chose operator/question disable his game operators
        this._players[playerIndex].set_Questions_Frame_State('disable');
        // Remove question from potential collection
        let qIdx = potentialQuestionsCollection.findIndex(q => q._word === question._word);
        if (qIdx !== -1) questions.push(potentialQuestionsCollection.splice(qIdx, 1)[0]);
        this._sendToPlayers('fromServer_toClient_show_the_new_question', questions[questions.length-1].toString());
        this._players.forEach(p => p.stats._add_AskedQuestion(questions[questions.length-1]._operator));

        this._setPlayersAnswerFrameState('enable'); // set enable so player can answer
    }

    _checkPlayerAnswer(playerIndex, answer_From_Player) {
        let asked_Question = questions[questions.length - 1];

        if (asked_Question._word === answer_From_Player._word) { // @@@@CHANGING
            this._players[playerIndex].stats._add_CorrectAnswer(asked_Question._operator);
            this._isPlayersAnswerCorrect[playerIndex] = true;
        } else // if wrong answer
            this._isPlayersAnswerCorrect[playerIndex] = false;
    }

    _checkRoundOver() { // check round over after every answer one of the player made
        let is_Round_End = true;
        this._isPlayersAnswerCorrect.forEach((a) => {
            if (a === null) is_Round_End = false;
        });
        if (is_Round_End === false) return;

        this._endRound();
    }

    _endRound() {
        this._update_Clients_Stats();

        if (this._roundCounter >= MAX_ROUNDS) {
            this._roundCounter = 0;
            this._sendToPlayers('fromServer_toClients_instruction_game', 'המשחק הסתיים');
            this._save_Stats_in_DB();
            setTimeout(() => {
                this._end_Game_Back_To_Games_Gallery()
            }, 5000);
            // this._sendToPlayers('end');
            // this._players[0]._socket.disconnect(true);
            // this._players[1]._socket.disconnect(true);
            return;
        }

        this._set_Next_Player_Turn();
        this._startNextRound();
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
            p.socket.removeAllListeners('fromClient_toServer_player_chose_questionWord');
            p.socket.removeAllListeners('fromClient_toServer_player_submitted_answer');
            // console.log(p.socket.eventNames());
        });
    }

    // @@@@CHANGING
    _generate_questions() {
        potentialQuestionsCollection = [
            new Question('Apple', 'תפוח'), new Question('House', 'בית'),
            new Question('Dog', 'כלב'), new Question('Sun', 'שמש'),
            new Question('Ball', 'כדור')
        ];
    }
}


// @@@@CHANGING
// #### specific ####
class Question {
    constructor(word, answer, operator = subFields[0].eng) {
        this._word = word;
        this._answer = answer;
        this._operator = operator;
    }

    toString() {
        return `${this._word}`;
    }
}

module.exports = EnglishGame;