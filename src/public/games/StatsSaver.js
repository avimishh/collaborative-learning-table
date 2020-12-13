const { Game } = require('../../models/game');
const { Stat } = require('../../models/stat');
const { Sheet } = require('../../models/sheet');

module.exports = async function (p_childId, p_stats, gameRefId, date = Date.now()) {
    // console.log(p_stats);
    let game = await Game.findById(gameRefId);
    if (!game) return console.log(`Failed to Find game.`);

    const newSheet = new Sheet({
        game: gameRefId,
        date: date,
        numOfQuestions: p_stats._getTotalAmountAskedQuestion(),
        numOfCorrectAnswers: p_stats._getTotalAmountCorrectAnswer(),
        additionalInfo: p_stats.subFields
    });
    // console.log(newSheet);

    let fieldName = game.field.nameEng;
    // console.log(fieldName);
    try {
        let stat = await Stat.findOne({ childId: p_childId });
        stat.sheets[fieldName].push(newSheet);
        // console.log(stat);
        await stat.save();
    } catch (ex) {
        // console.log(ex);
        return console.log(`Failed to update Stats.`);
    }
}