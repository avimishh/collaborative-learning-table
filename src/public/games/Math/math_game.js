const save_Data_DB = require('./../gameStatsSaver');
const { Player } = require('./../models/player');
const { Game } = require('./../models/game');
const { Stats } = require('./../models/stats');

var questions = [];
// const
const MAX_ROUNDS = 3;


function init_Game_Listeners() {

}

var playerToPlay, playerToWait;

class MathGame {
    constructor(p0, p1, game) {
        this._game_id =  game.id;
        // #### Global ####
        this._players = [p0, p1];

        this._isPlayersAnswerCorrect = [null, null];
        // change message to header
        this._sendToPlayers('message', 'המשחק החל');
        // ################

        this._players.forEach(p => {
            p.set_Player_Stat(new MathStats);
        });

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
        playerToPlay.send_Message_To_Client('message', 'תורך לבחור פעולה');
        playerToPlay.set_Operators_State('enable');
        playerToWait.send_Message_To_Client('message', 'המתן לחברך בבחירת פעולה');
        playerToWait.set_Operators_State('disable');
        // this._setMathOperatorsState(playerToPlay, 'enable');    // specific
        // this._sendToPlayer(playerToWait, 'message', 'המתן לחברך בבחירת פעולה');
        // this._setMathOperatorsState(playerToWait, 'disable');   // specific
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
        this._Stats_Update_To_Client();
        this._isPlayersAnswerCorrect = [null, null];
        this._set_Next_Player_Turn();
        this._roundCounter++;

        if (this._roundCounter >= MAX_ROUNDS) {
            this._sendToPlayers('message', 'המשחק הסתיים');
            this._Save_Stats_in_DB();
            // this._sendToPlayers('end');
            // this._players[0]._socket.disconnect(true);
            // this._players[1]._socket.disconnect(true);
            return;
        }

        this._startRound();
    }

    _Stats_Update_To_Client() {
        this._players[0].update_Client_Stats([this._players[0].stats._stats, this._players[1].stats._stats]);
        this._players[1].update_Client_Stats([this._players[1].stats._stats, this._players[0].stats._stats]);
        // this._players[0].socket.emit('stats', [this._players[0].stats._stats, this._players[1].stats._stats]);
        // this._players[1].socket.emit('stats', [this._players[1].stats._stats, this._players[0].stats._stats]);
    }

    _Save_Stats_in_DB() {
        this._players.forEach(async (p) =>  {
            // let gameID = '5f2c39eb0a7d2569742bb278';
            // save_Data_DB(p.id, p._stats, p.numOfQuestions, p.numOfQuestions, gameID);
            await save_Data_DB(p.id, p.stats, this._game_id);
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
            case 'mult':
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
            case 'mult':
                op = '*';
                break;
            default:
                console.log('DEBUG: error in _questionToString()');
        }

        return `${this._oprnd1} ${op} ${this._oprnd2}`;
    }
}


class MathStats extends Stats {
    constructor() {
        super();
        // this.numOfQuestions = 0;
        // this.numOfCorrectAnswers = 0;
        this._stats = [{
            operator: 'Plus',
            asked: 0,
            correct: 0
        },
        {
            operator: 'Minus',
            asked: 0,
            correct: 0
        },
        {
            operator: 'Multi',
            asked: 0,
            correct: 0
        }]
    }

    _add_Asked_Question(operation) {
        switch (operation) {
            case 'plus':
                this._stats[0].asked++;
                break;
            case 'minus':
                this._stats[1].asked++;
                break;
            case 'mult':
                this._stats[2].asked++;
                break;
        }
        super._add_Asked_Question();
    }

    _add_Correct_Answer(operation) {
        switch (operation) {
            case 'plus':
                this._stats[0].correct++;
                break;
            case 'minus':
                this._stats[1].correct++;
                break;
            case 'mult':
                this._stats[2].correct++;
                break;
        }
        super._add_Correct_Answer();
    }
}


module.exports = MathGame;