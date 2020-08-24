class Stats {
    constructor() {
        this.numOfQuestions = 0;
        this.numOfCorrectAnswers = 0;
    }

    _add_Asked_Question(){
        this.numOfQuestions++;
    }

    _add_Correct_Answer(){
        this.numOfCorrectAnswers++;
    }
}

module.exports.Stats = Stats;