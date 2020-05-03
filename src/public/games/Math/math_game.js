const saveData = require('./../gameStatsSaver');
// saveData('p._statsObject_id', [
//     { operator: 'Plus', asked: 3, correct: 0 },
//     { operator: 'Minus', asked: 1, correct: 0 },
//     { operator: 'Multi', asked: 1, correct: 0 }
//   ]);
class MathGame {
    constructor(p0, p1) {
        
        // saveData('5ea97717caf7119aece7c00b','5eac638a732138f61c03e3b9',[
        //     { operator: 'Plus', asked: 3, correct: 0 },
        //     { operator: 'Minus', asked: 1, correct: 0 },
        //     { operator: 'Multi', asked: 1, correct: 0 }
        //   ]);
        this._players = [new Player(p0.sock,p0.stats), new Player(p1.sock, p1.stats)];
        this._whoseTurn = 0;    // By default player0 starts
        this._isPlayersAnswerCorrect = [null, null];
        this._roundCounter = 0;

        this._sendToPlayers('message', 'התחלנו לשחק');

        // Add listener ask question
        this._players.forEach((player, idx) => {
            player._socket.on('math_op', (op) => {
                this._askQuestion(idx, op);
            });
        });

        this._players.forEach((player, idx) => {
            player._socket.on('answer_submitted', (answer) => {
                this._checkAnswer(idx, answer);
                this._checkRoundOver();
            });

            // player._socket.on('setStatsObject', (statsObject_id) => {
            //     player._statsObject_id = statsObject_id;
            //     console.log(statsObject_id);
            // });
            player._socket.on('saveStatsInDB', () => {
                console.log('a');
                // saveData(player._id, '5eac638a732138f61c03e3b9', this._players[0]._stats);
                saveData(player._statsObject_id, player._stats);
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
        this._setNumbersPadState('enable');
    }


    _checkAnswer(playerIndex, answer) {
        // console.log(answer);
        // console.log(questions[questions.length-1]);
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

    _checkRoundOver() {
        let isRoundEnd = true;
        this._isPlayersAnswerCorrect.forEach((a) => {
            if (a === null) {
                isRoundEnd = false;
            }
        });
        if (isRoundEnd === false) return;
        // console.log(this._isPlayersAnswerCorrect);
        this._endRound();
    }

    _endRound() {
        this._statsUpdate();
        this._isPlayersAnswerCorrect = [null, null]
        this._changeWhoseTurn();
        // this._firstPlayerTurn = !this._firstPlayerTurn;
        this._roundCounter++;

        if (this._roundCounter >= 2) {
            this._sendToPlayers('message', 'המשחק הסתיים');
            this._statsSaveInDB();
            this._sendToPlayers('end');
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
            // console.log(p._stats);
            // p._socket.emit('saveStatsInDB');
            saveData(p._statsObject_id, p._stats);
        });
        // saveData('5ea97717caf7119aece7c00b','5eac638a732138f61c03e3b9',[
        //     { operator: 'Plus', asked: 3, correct: 0 },
        //     { operator: 'Minus', asked: 1, correct: 0 },
        //     { operator: 'Multi', asked: 1, correct: 0 }
        //   ]);
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
        // this._stats = {
        //     plus: {
        //         asked: 0,
        //         correct: 0
        //     },
        //     minus: {
        //         asked: 0,
        //         correct: 0
        //     },
        //     mult: {
        //         asked: 0,
        //         correct: 0
        //     }
        // }

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
        // console.log(operation);
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


var questions = [];


module.exports = MathGame;