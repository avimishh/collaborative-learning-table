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
const MAX_ROUNDS = 2;
var playerToPlay, playerToWait;

// function math_op(op){
//     this._askQuestion(idx, op);
// }

class MathGame { // @@@@CHANGING
    constructor(p0, p1, game) {
        this._game_id = game.id;

        this._players = [p0, p1];
        this._isPlayersAnswerCorrect = [null, null];

        this._sendToPlayers('fromServer_toClients_instruction_game', 'המשחק החל');

        this._players.forEach(p => p.set_Player_Stat(new Stats(field, subFields)));   
        this._update_Client_Stats();
        // #### Specific Listeners ####
        // Add listener 
        this._players.forEach((player, idx) => {
            // after player chose operator create new question
            player.socket.on('math_op', (op) => {
                this._askQuestion(idx, op);
            });

            player.socket.on('answer_submitted', (answer) => {
                this._checkAnswer(idx, answer);
                this._checkRoundOver();
            });
        });
        // ############################

        this._roundCounter = 0;
        this._whoseTurn = 0;    // By default player0 starts
        this._startRound();
    }

    // #### Global ####
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

    _startRound() {
        this._determineTurn();
    }

    _determineTurn() {
        playerToPlay = this._players[this._whoseTurn];
        playerToWait = this._players[(this._whoseTurn === 1) ? 0 : 1];
        playerToPlay.send_Message_To_Client('fromServer_toClients_instruction_game', 'תורך לבחור פעולה');
        playerToPlay.set_Operators_State('enable');
        playerToWait.send_Message_To_Client('fromServer_toClients_instruction_game', 'המתן לחברך בבחירת פעולה');
        playerToWait.set_Operators_State('disable');
    }

    _set_Next_Player_Turn() {
        this._whoseTurn = (this._whoseTurn === 1) ? 0 : 1;
    }
    // ################

    _setMathOperatorsState(playerIndex, state) {
        this._players[playerIndex].set_Operators_State('disableOperators', state)
    }

    // numbers pad = where the player write his answer
    _setNumbersPadState(state) {
        this._sendToPlayers('gamePadState', state)
    }

    _askQuestion(playerIndex, op) {
        // After player chose operator disable his game operators
        // this._setMathOperatorsState(playerIndex, 'disable');
        this._players[playerIndex].set_Operators_State('disable');

        var new_Question = new Question(op);
        questions.push(new_Question);
        this._sendToPlayers('question', new_Question.toString());
        this._players.forEach(p => p.stats._add_Asked_Question(op));

        this._setNumbersPadState('enable'); // set enable so player can answer
    }

    _checkAnswer(playerIndex, answer_From_Player) {
        let asked_Question = questions[questions.length - 1];
        // if correct answer
        if (asked_Question._correct_Answer === parseInt(answer_From_Player)) {
            this._players[playerIndex].stats._add_Correct_Answer(asked_Question._operator);
            this._isPlayersAnswerCorrect[playerIndex] = true;
        }
        // if wrong answer
        else
            this._isPlayersAnswerCorrect[playerIndex] = false;
    }

    // check round over after every answer one of the player made
    _checkRoundOver() {
        let is_Round_End = true;
        this._isPlayersAnswerCorrect.forEach((a) => {
            if (a === null) is_Round_End = false;
        });
        if (is_Round_End === false) return;

        this._endRound();
    }

    _endRound() {
        this._update_Client_Stats();
        this._isPlayersAnswerCorrect = [null, null];
        this._set_Next_Player_Turn();
        this._roundCounter++;

        if (this._roundCounter >= MAX_ROUNDS) {
            this._roundCounter = 0;
            this._sendToPlayers('fromServer_toClients_instruction_game', 'המשחק הסתיים');
            this._Save_Stats_in_DB();
            setTimeout(() => { this._end_Game_Back_To_Games_Gallery() }, 5000);
            // this._sendToPlayers('end');
            // this._players[0]._socket.disconnect(true);
            // this._players[1]._socket.disconnect(true);
            return;
        }

        this._startRound();
    }

    _update_Client_Stats() {
        this._players[0].update_Client_Stats([this._players[0].stats, this._players[1].stats]);
        this._players[1].update_Client_Stats([this._players[1].stats, this._players[0].stats]);
    }

    _Save_Stats_in_DB() {
        this._players.forEach(async (p) => {
            await save_Data_DB(p.id, p.stats, this._game_id);
        });
    }

    _end_Game_Back_To_Games_Gallery() {
        this._removeListeners();
        this._sendToPlayers('players_ready_host_choose_game');
    }

    _removeListeners() {
        this._players.forEach(p => {
            p.socket.removeAllListeners('math_op');
            p.socket.removeAllListeners('answer_submitted');
            // console.log(p.socket.eventNames());
        });
    }
}

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


module.exports = MathGame;