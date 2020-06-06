const saveData = require('./../gameStatsSaver');


// const
const MAX_ROUNDS = 3;
var questions = [];
var askedQuestions = [];

class EnglishGame {
    constructor(p0, p1) {
        this._players = [new Player(p0.sock, p0.stats), new Player(p1.sock, p1.stats)];
        this._whoseTurn = 0;    // By default player0 starts
        this._isPlayersAnswerCorrect = [null, null];
        this._roundCounter = 0;

        this._sendToPlayers('message', 'התחלנו לשחק');
        this._generate_questions();

        // Add listener 
        this._players.forEach((player, idx) => {
            // after player chose operator create new question
            player._socket.on('player_chose_word', (question) => {
                this._askQuestion(idx, question);
            });

            player._socket.on('answer_submitted', (question) => {
                this._checkAnswer(idx, question);
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
        this._sendToPlayers('set_questions', questions);
        let idx_turn = this._determineTurn();
    }

    _determineTurn() {
        let playerToPlay = this._whoseTurn;
        let playerToWait = (this._whoseTurn === 1) ? 0 : 1;
        this._sendToPlayer(playerToPlay, 'תורך לבחור פעולה');
        this._setPlayerToAsk(playerToPlay, 'enable');
        this._sendToPlayer(playerToWait, 'המתן לחברך בבחירת פעולה');
        this._setPlayerToAsk(playerToWait, 'disable');
        return playerToPlay;
    }

    _changeWhoseTurn() {
        if (this._whoseTurn === 1)
            this._whoseTurn = 0;
        else
            this._whoseTurn = 1;
    }

    _setPlayerToAsk(playerIndex, state) {
        this._players[playerIndex]._socket.emit('chooseWordScreen', state);
    }

    // numbers pad = where the player write his answer
    _setAnswersPadState(state) {
        this._sendToPlayers('gamePadState', state)
    }

    _askQuestion(playerIndex, question) {
        // After player chose operator disable his game operators
        this._setPlayerToAsk(playerIndex, 'disable');
        this._players.forEach(p => p._updateAskedQuestion());
        // Remove question from original array
        let qIdx = questions.findIndex(q => q._word === question._word);
        if (qIdx !== -1) askedQuestions.push(questions.splice(qIdx, 1));
        ////
        this._sendToPlayers('question', question._word);
        this._setAnswersPadState('enable'); // set enable so player can answer
    }

    _checkAnswer(playerIndex, player_answer_question) {
        let asked_question = askedQuestions[askedQuestions.length - 1];
        if (asked_question[0]._word === player_answer_question._word) {
            this._players[playerIndex]._addScore();
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

    _generate_questions(){
        questions = [
            new Question('Apple', 'תפוח'), new Question('House', 'בית'), 
            new Question('Dog', 'כלב'), new Question('Sun', 'שמש'),
            new Question('Ball', 'כדור')
        ];
    }
}

class Question {
    constructor(word, answer) {
        this._word = word;
        this._answer = answer;
        // this._oprnd1 = this._randomNum();
        // this._oprnd2 = this._randomNum();
        // this._operator = operator;
        // this._result = Math.abs(this._calculateQuestionResult());
    }

    // _randomNum(factor = 10) {
    //     return Math.floor(Math.random() * factor) + 1;
    // }

    // _calculateQuestionResult() {
    //     let res = 0;
    //     switch (this._operator) {
    //         case 'plus':
    //             res = this._oprnd1 + this._oprnd2;
    //             break;
    //         case 'minus':
    //             res = this._oprnd1 - this._oprnd2;
    //             break;
    //         case 'mult':
    //             res = this._oprnd1 * this._oprnd2;
    //             break;
    //         default:
    //             console.log('DEBUG: error in _calculateQuestionResult()');
    //     }

    //     return res;
    // }

    toString() {

        return `${this._word}?`;
    }
}


class Player {
    constructor(socket, stats) {
        this._socket = socket;
        this._statsObject_id = stats;
        this._stats = {
            asked: 0,
            correct: 0
        };
        
        // [{
        //     operator: 'Plus',
        //     asked: 0,
        //     correct: 0
        // },
        // {
        //     operator: 'Minus',
        //     asked: 0,
        //     correct: 0
        // },
        // {
        //     operator: 'Multi',
        //     asked: 0,
        //     correct: 0
        // }]
    }

    _addScore() {
        this._stats.correct++;
        // switch (operation) {
        //     case 'plus':
        //         this._stats[0].correct++;
        //         break;
        //     case 'minus':
        //         this._stats[1].correct++;
        //         break;
        //     case 'mult':
        //         this._stats[2].correct++;
        //         break;
        // }
    }

    _updateAskedQuestion() {
        this._stats.asked++;
        // switch (operation) {
        //     case 'plus':
        //         this._stats[0].asked++;
        //         break;
        //     case 'minus':
        //         this._stats[1].asked++;
        //         break;
        //     case 'mult':
        //         this._stats[2].asked++;
        //         break;
        // }
    }
}


module.exports = EnglishGame;