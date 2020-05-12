const saveData = require('./../gameStatsSaver');


var questions = [];
// const
const MAX_ROUNDS = 1;

class MathGame {
    constructor(p0, p1) {
        p0.sock.emit('end');
        // console.log(p1.stats);
        this._players = [new Player(p0.sock, p0.stats), new Player(p1.sock, p1.stats)];
        this._whoseTurn = 0;    // By default player0 starts
        this._isPlayersAnswerCorrect = [null, null];
        this._roundCounter = 0;

        this._sendToPlayers('message', 'התחלנו לשחק');


        // Add listener 
        this._players.forEach((player, idx) => {
            // after player chose operator create new question
            player._socket.on('math_op', (op) => {
                this._askQuestion(idx, op);
            });

            player._socket.on('answer_submitted', (answer) => {
                this._checkAnswer(idx, answer);
                this._checkRoundOver();
            });
        });

        this._startRound();
    }

    // Message to 1 player
    _sendToPlayer(playerIndex, msg) {
        this._players[playerIndex]._socket.emit('message', msg);
    }

    // Message for both players
    _sendToPlayers(type, msg) {
        this._players.forEach((player) => {
            player._socket.emit(type, msg)
        });
    }

    _startRound() {
        let idx_turn = this._determineTurn();
    }

    _determineTurn() {
        let playerToPlay = this._whoseTurn;
        let playerToWait = (this._whoseTurn === 1) ? 0 : 1;
        this._sendToPlayer(playerToPlay, 'תורך לבחור פעולה');
        this._setMathOperatorsState(playerToPlay, 'enable');
        this._sendToPlayer(playerToWait, 'המתן לחברך בבחירת פעולה');
        this._setMathOperatorsState(playerToWait, 'disable');
        return playerToPlay;
    }

    _changeWhoseTurn() {
        if (this._whoseTurn === 1)
            this._whoseTurn = 0;
        else
            this._whoseTurn = 1;
    }

    _setMathOperatorsState(playerIndex, state) {
        this._players[playerIndex]._socket.emit('disableOperators', state);
    }

    // numbers pad = where the player write his answer
    _setNumbersPadState(state) {
        this._sendToPlayers('gamePadState', state)
    }

    _askQuestion(playerIndex, op) {
        // After player chose operator disable his game operators
        this._setMathOperatorsState(playerIndex, 'disable');

        var new_question = new Question(op);
        this._players.forEach(p => p._updateAskedQuestion(op));
        questions.push(new_question);
        this._sendToPlayers('question', new_question.toString());
        this._setNumbersPadState('enable'); // set enable so player can answer
    }

    _checkAnswer(playerIndex, answer) {
        let asked_question = questions[questions.length - 1];
        if (asked_question._result === parseInt(answer)) {
            this._players[playerIndex]._addScore(asked_question._operator);
            this._isPlayersAnswerCorrect[playerIndex] = true;
            return true;
        }
        else {
            this._isPlayersAnswerCorrect[playerIndex] = false;
            return false;
        }
    }

    // check round over after every answer one of the player made
    _checkRoundOver() {
        let isRoundEnd = true;
        this._isPlayersAnswerCorrect.forEach((a) => {
            if (a === null) isRoundEnd = false;
        });
        if (isRoundEnd === false) return;

        this._endRound();
    }

    _endRound() {
        this._statsUpdate();
        this._isPlayersAnswerCorrect = [null, null];
        this._changeWhoseTurn();
        this._roundCounter++;

        if (this._roundCounter >= MAX_ROUNDS) {
            this._sendToPlayers('message', 'המשחק הסתיים');
            this._statsSaveInDB();
            // this._sendToPlayers('end');
            // this._players[0]._socket.disconnect(true);
            // this._players[1]._socket.disconnect(true);
            return;
        }

        this._startRound();
    }

    _statsUpdate() {
        this._players[0]._socket.emit('stats', [this._players[0]._stats, this._players[1]._stats]);
        this._players[1]._socket.emit('stats', [this._players[1]._stats, this._players[0]._stats]);
    }

    _statsSaveInDB() {
        this._players.forEach(p => {
            saveData(p._statsObject_id, p._stats, questions.length);
        });
    }
}

class Question {
    constructor(operator) {
        this._oprnd1 = this._randomNum();
        this._oprnd2 = this._randomNum();
        this._operator = operator;
        this._result = Math.abs(this._calculateQuestionResult());
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


class Player {
    constructor(socket, stats) {
        this._socket = socket;
        this._statsObject_id = stats;
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

    _addScore(operation) {
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
    }

    _updateAskedQuestion(operation) {
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
    }
}


module.exports = MathGame;