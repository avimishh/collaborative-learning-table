const { Game } = require('../../models/game');
const { Stat } = require('../../models/stat');
const { Sheet } = require('../../models/sheet');

// module.exports = async function (statsObject_id, stats, numOfQuestions, gameRefId) {

module.exports = async function (p_child_ID, stats, gameRefId) {
    // let numOfCorrectAnswers = 2;
    p_child_ID = '1002';

    const newSheet = new Sheet({
        game: gameRefId,
        date: Date.now(),
        numOfQuestions: stats.numOfQuestions,
        numOfCorrectAnswers: stats.numOfCorrectAnswers,
        additionalInfo: stats._stats
    });

    let game = await Game.findById(gameRefId);
    if(!game) return console.log(`Failed to Find game.`);
    let fieldName = field_To_English(game.field.name);
    // fieldName = 'math';

    try {
        let stat = await Stat.findOne({ child_id: p_child_ID });
        stat.sheets[fieldName].push(newSheet);
        await stat.save();

        // let stat = await Stat.findOneAndUpdate({ child_id: p_child_ID },
        //     {
        //         "$addToSet": { 'sheets.$.fieldName': newSheet }
        //     }, {
        //     new: true, useFindAndModify: false
        // });
    } catch (ex) {
        return console.log(`Failed to update Stats.`);
    }
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


// module.exports = async function (statsObject_id, stats, num_questions) {
//     // console.log('saving stats ' + statsObject_id);
//     const new_sheet = new MathSheet({
//         number_of_questions: num_questions,
//         date: Date.now(),
//         questions: stats
//     });
//     try {
//         let mathStat = await MathStat.findByIdAndUpdate(statsObject_id,
//         {
//             $push: { sheets: new_sheet }
//         }, {
//             new: true, useFindAndModify: false
//         });
//     } catch (ex) {
//         return console.log(`Failed to update Stats.`);
//     }
// }