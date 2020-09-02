const { Game } = require('../../models/game');
const { Stat } = require('../../models/stat');
const { Sheet } = require('../../models/sheet');
const { mathSheetSchema } = require('../../models/sheets/math');

module.exports = async function (p_child_ID, stats, gameRefId, date = Date.now()) {
    // console.log('p_child_ID: ' + p_child_ID);
    stats._stats.forEach(e => {
        e.operator = Operator_To_English(e.operator);
    });

    const newSheet = new Sheet({
        game: gameRefId,
        date: date,
        numOfQuestions: stats.numOfQuestions,
        numOfCorrectAnswers: stats.numOfCorrectAnswers,
        additionalInfo: stats._stats
    });

    let game = await Game.findById(gameRefId);
    if (!game) return console.log(`Failed to Find game.`);
    let fieldName = field_To_English(game.field.name);

    try {
        let stat = await Stat.findOne({ child_id: p_child_ID });
        stat.sheets[fieldName].push(newSheet);
        await stat.save();
    } catch (ex) {
        return console.log(`Failed to update Stats.`);
    }
}

function Operator_To_English(operator) {
    let res = '';
    switch (operator) {
        case 'Plus':
            res = 'חיבור'
            break;
        case 'Minus':
            res = 'חיסור'
            break;
        case 'Multi':
            res = 'כפל'
            break;
        case 'engToHeb':
            res = 'תרגום מאנגלית לעברית'
            break;
        case 'hebToEng':
            res = 'תרגום מעברית לאנגלית'
            break;
        case 'picToEng':
            res = 'התאמת תמונות למילים'
            break;
        default:
            res = 'general'
            break;
    }
    return res;
}

function field_To_English(fieldName) {
    let res = '';
    switch (fieldName) {
        case 'חשבון':
            res = 'math'
            break;
        case 'אנגלית':
            res = 'english'
            break;
        case 'צבעים':
            res = 'color'
            break;
        case 'זכרון':
            res = 'memory'
            break;
        default:
            res = 'general'
            break;
    }
    return res;
}