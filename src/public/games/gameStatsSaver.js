const { Game } = require('../../models/game');
// const { Game } = require('../../models/game');
const { MathStat } = require('../../models/mathStat');
const { MathSheet } = require('../../models/mathSheet');

module.exports = async function (statsObject_id, stats) {
    console.log('saving stats ' + statsObject_id);
    // async function saveData(childId, gameId, stats) {
    const new_sheet = new MathSheet({
        number_of_questions: 0,
        date: Date.now(),
        questions: stats
    });
    // console.log(new_sheet);
    try {
        let mathStat = await MathStat.findByIdAndUpdate(statsObject_id,
        //     child: childId,
        //     game: gameId
        // }, 
        {
            $push: { sheets: new_sheet }
        }, {
            new: true, useFindAndModify: false
        });
    } catch (ex) {
        return console.log(`Failed to update Stats.`);
    }

    // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
    // find by child and game
    // let mathStat = await MathStat.findOneAndUpdate({
    //     child: childId,
    //     game: gameId
    // }, {
    //     $push: { sheets: new_sheet }
    // });

    // // if not exist create new one
    // if (!mathStat) {
    //     console.log('not exist');
    // let mathStat = new MathStat({
    //     child: childId,
    //     game: gameId,
    //     sheets: []
    // });
    // }

    // await mathStat.save();



    // await mathStat.save();

    // let questions = [{
    //     operator: 'Plus', 
    //     asked: stats.plus.saked
    // }]
    // const mathStat
}


// module.exports.saveData = saveData;