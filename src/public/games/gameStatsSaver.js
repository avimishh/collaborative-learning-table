const { Game } = require('../../models/game');
const { MathStat } = require('../../models/mathStat');
const { MathSheet } = require('../../models/mathSheet');


module.exports = async function (statsObject_id, stats, num_questions) {
    // console.log('saving stats ' + statsObject_id);
    const new_sheet = new MathSheet({
        number_of_questions: num_questions,
        date: Date.now(),
        questions: stats
    });
    try {
        let mathStat = await MathStat.findByIdAndUpdate(statsObject_id,
        {
            $push: { sheets: new_sheet }
        }, {
            new: true, useFindAndModify: false
        });
    } catch (ex) {
        return console.log(`Failed to update Stats.`);
    }
}