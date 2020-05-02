class MathGame {
    constructor(p0_sock, p1_sock){
        this._players = [new Player(p0_sock), new Player(p1_sock)];
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
        });

        this._startRound();
    }

    // Message to 1 player
    _sendToPlayer(playerIndex, msg){
        this._players[playerIndex]._socket.emit('message', msg);
    }

    // Message for both players
    _sendToPlayers(type, msg){
        this._players.forEach((player) => {
            player._socket.emit(type, msg)
        });
    }

    _startRound(){
        let idx_turn = this._determineTurn();
        
    }

    _determineTurn(){
        let playerToPlay = this._whoseTurn;
        let playerToWait = (this._whoseTurn===1) ? 0 : 1 ;
        this._sendToPlayer(playerToPlay,'תורך לבחור פעולה');
        this._setMathOperatorsState(playerToPlay,'enable');
        this._sendToPlayer(playerToWait,'המתן לחברך בבחירת פעולה');
        this._setMathOperatorsState(playerToWait,'disable');
        return playerToPlay;
    }

    _changeWhoseTurn(){
        if(this._whoseTurn === 1)
            this._whoseTurn = 0;
        else
            this._whoseTurn = 1;
    }

    _setMathOperatorsState(playerIndex, state){
        this._players[playerIndex]._socket.emit('disableOperators', state);
    }

    _setNumbersPadState(state){
        this._sendToPlayers('gamePadState', state)
    }

    _askQuestion(playerIndex, op){
        // After player chose operator disable his game operators
        this._setMathOperatorsState(playerIndex,'disable');

        var new_question = new Question(op);
        
        questions.push( new_question );
        this._sendToPlayers('question', new_question.toString() );
        this._setNumbersPadState('enable');
    }


    _checkAnswer(playerIndex, answer){
        // console.log(answer);
        // console.log(questions[questions.length-1]);
        let asked_question = questions[questions.length-1];
        if( asked_question._result === parseInt(answer) ){
            this._players[playerIndex]._addScore( asked_question._operator );
            this._isPlayersAnswerCorrect[playerIndex] = true;
            return true;
        }
        else{
            this._isPlayersAnswerCorrect[playerIndex] = false;
            return false;
        }
    }

    _checkRoundOver(){
        let isRoundEnd = true;
        this._isPlayersAnswerCorrect.forEach( (a) => {
            if(a === null){
                isRoundEnd = false;
            }
        });
        if(isRoundEnd === false) return;
        // console.log(this._isPlayersAnswerCorrect);
        this._endRound();
    }

    _endRound(){
        this._statsUpdate();
        this._isPlayersAnswerCorrect = [null, null]
        this._changeWhoseTurn();
        // this._firstPlayerTurn = !this._firstPlayerTurn;
        this._roundCounter++;

        if(this._roundCounter >= 5 ) return this._sendToPlayers('message', 'המשחק הסתיים');
        
        this._startRound();
    }

    _statsUpdate(){
        this._players[0]._socket.emit('stats', [this._players[0]._stats, this._players[1]._stats]);
        this._players[1]._socket.emit('stats', [this._players[1]._stats, this._players[0]._stats]);
    }
}

class Question {
    constructor(operator){
        this._oprnd1 = this._randomNum();
        this._oprnd2 = this._randomNum();
        this._operator = operator;
        this._result = Math.abs( this._calculateQuestionResult() );
    }

    _randomNum(factor = 10){
        return Math.floor( Math.random() * factor ) + 1;
    }

    _calculateQuestionResult(){
        let res = 0;
        switch(this._operator){
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

    toString(){
        let op = '+';
        switch(this._operator){
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
    constructor(socket){
        this._socket = socket;
        this._stats = {
            plus:0,
            minus:0,
            mult:0
        }
    }

    _addScore(operation){
        // console.log(operation);
        switch(operation){
            case 'plus':
                this._stats.plus++;
                break;
            case 'minus':
                this._stats.minus++;
                break;
            case 'mult':
                this._stats.mult++;
                break;    
        }
    }
}


var questions = [];


module.exports = MathGame;