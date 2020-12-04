class Stats {
    constructor(field, subFields) {
        this._field = field;
        this._numOfQuestions = 0;
        this._numOfCorrectAnswers = 0;
        this.subFields = [];
        subFields.forEach(subField => {
            this.subFields.push({
                operator: subField.eng,
                operatorHeb: subField.heb,
                asked: 0,
                correct: 0
            });
        });
    }

    _add_AskedQuestion(operation) {
        console.log(operation);
        this.subFields.find(s => s.operator === operation).asked++;
    }

    _add_CorrectAnswer(operation) {
        this.subFields.find(s => s.operator === operation).correct++;
    }

    _getTotalAmountAskedQuestion(){
        let totalAsked = 0;
        this.subFields.forEach(sf => totalAsked += sf.asked);
        return totalAsked;
    }

    _getTotalAmountCorrectAnswer(){
        let totalCorrect = 0;
        this.subFields.forEach(sf => totalCorrect += sf.correct);
        return totalCorrect;
    }
}

module.exports.Stats = Stats;