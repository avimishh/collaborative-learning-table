const { Game } = require('../../models/game');
const { MathStat } = require('../../models/mathStat');
const { MathSheet } = require('../../models/mathSheet');
const { Stat } = require('../../models/stat');
const { Sheet } = require('../../models/sheet');


module.exports = async function (statsObject_id, stats, numOfQuestions, gameRefId) {
    let numOfCorrectAnswers = 2;
    let p_child_ID = '1002';
    
    const newSheet = new Sheet({
        game: gameRefId,
        date: Date.now(),
        numOfQuestions,
        numOfCorrectAnswers,
        additionalInfo: {}
    });

    let game = await Game.findById(gameRefId);
    let fieldName = game.field.name;
    fieldName = 'math';

    let stat = await Stat.findOne({ child_id: p_child_ID });
    stat.sheets[fieldName].push(newSheet);
    await stat.save();

    try {
        let stat = await Stat.findOneAndUpdate({ child_id: p_child_ID },
            {
                "$addToSet": { 'sheets.$.fieldName': newSheet }
            }, {
            new: true, useFindAndModify: false
        });
    } catch (ex) {
        return console.log(`Failed to update Stats.`);
    }
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