const { Game } = require('../../models/game');
const { Stat } = require('../../models/stat');
const { Sheet } = require('../../models/sheet');
const { mathSheetSchema } = require('../../models/sheets/math');

module.exports = async function (p_child_id, p_stats, gameRefId, date = Date.now()) {
    let game = await Game.findById(gameRefId);
    if (!game) return console.log(`Failed to Find game.`);

    const newSheet = new Sheet({
        game: gameRefId,
        date: date,
        numOfQuestions: p_stats._getTotalAmountAskedQuestion(),
        numOfCorrectAnswers: p_stats._getTotalAmountCorrectAnswer(),
        additionalInfo: p_stats.subFields
    });
    console.log(newSheet);

    let fieldName = game.field.nameEng;
    console.log(fieldName);
    try {
        let stat = await Stat.findOne({ child_id: p_child_id });
        stat.sheets[fieldName].push(newSheet);
        await stat.save();
    } catch (ex) {
        return console.log(`Failed to update Stats.`);
    }
}