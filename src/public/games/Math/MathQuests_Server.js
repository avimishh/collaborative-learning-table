const save_Data_DB = require('../StatsSaver');
const { Player } = require('../models/player');
const { Game } = require('../models/game');
const { Stats } = require('../models/stats');
// @@@@CHANGING
const field = 'math';
const subFields = [{eng: 'plus', heb: 'חיבור'},
                    {eng: 'minus', heb: 'חיסור'},
                    {eng: 'multi', heb: 'כפל'}];
// @@@@

var questions = [];
const MAX_ROUNDS = 3;
const P0= 0, P1 = 1;

class MathGame { // @@@@CHANGING
    constructor(player0, player1, game) {
        this._game_id = game.id;

        this._players = [player0, player1];
        this._players.forEach(p => p.set_Player_Stat(new Stats(field, subFields)));   

        this._sendToPlayers('fromServer_toClients_instruction_game', 'המשחק החל');

        // #### Specific Listeners ####
        // Add listeners
        this._players.forEach((player, idx) => {
            // after player chose operator create new question
            player.socket.on('fromClient_toServer_notify_subField_selected', (op) => { // @@@@CHANGING
                this._askNewQuestion(idx, op);
            });

            player.socket.on('fromClient_toServer_player_submitted_answer', (answer) => {
                this._checkPlayerAnswer(idx, answer);
                this._checkRoundOver();
            });
        });
        // ############################

        this._isPlayersAnswerCorrect = [null, null];
        this._roundCounter = 0;
        this._whoseTurn = P0;    // By default player0 starts
        this._update_Clients_Stats();   // first initialize all to 0
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
    _askNewQuestion(playerIndex, op) {
        // After player chose operator/question disable his game operators
        this._players[playerIndex].set_Operators_Frame_State('disable'); 

        var new_Question = new Question(op); 
        questions.push(new_Question);
        this._sendToPlayers('fromServer_toClient_show_the_new_question', new_Question.toString());
        this._players.forEach(p => p.stats._add_AskedQuestion(op));

        this._setPlayersAnswerFrameState('enable'); // set enable so player can answer
    }

    _checkPlayerAnswer(playerIndex, answer_From_Player) {
        let asked_Question = questions[questions.length - 1];
        
        if (asked_Question._correct_Answer === parseInt(answer_From_Player)) { // @@@@CHANGING
            this._players[playerIndex].stats._add_CorrectAnswer(asked_Question._operator);
            this._isPlayersAnswerCorrect[playerIndex] = true;
        }
        // if wrong answer
        else
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
            setTimeout(() => { this._end_Game_Back_To_Games_Gallery() }, 5000);
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
            p.socket.removeAllListeners('fromClient_toServer_notify_subField_selected');
            p.socket.removeAllListeners('fromClient_toServer_player_submitted_answer');
            // console.log(p.socket.eventNames());
        });
    }
}

// @@@@CHANGING
// #### specific ####
class Question {
    constructor(operator) {
        this._oprnd1 = this._randomNum();
        this._oprnd2 = this._randomNum();
        this._operator = operator;
        this._correct_Answer = Math.abs(this._calculateQuestionResult());
    }

    _randomNum(factor = 10) {
        return Math.floor(Math.random() * factor) + 1;
    }

    _calculateQuestionResult() {
        let res = 0;
        switch (this._operator) {
            case 'plus':
                res = this._oprnd1 + this._oprnd2;
                break;
            case 'minus':
                res = this._oprnd1 - this._oprnd2;
                break;
            case 'multi':
                res = this._oprnd1 * this._oprnd2;
                break;
            default:
                console.log('DEBUG: error in _calculateQuestionResult()');
        }
        return res;
    }

    toString() {
        let op = '+';
        switch (this._operator) {
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
                console.log('DEBUG: error in _questionToString()');
        }
        return `${this._oprnd1} ${op} ${this._oprnd2}`;
    }
}

// @@@@CHANGING
module.exports = MathGame;