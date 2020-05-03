const express = require('express');
const router = express.Router();
const { Game, validate } = require('../models/game');
const { MathStat } = require('../models/mathStat');
const { setGameToPlay, startGame } = require('./../public/games/gameStarter');

// POST ['api/playGames/start']
router.post('/start', async (req, res) => {
    const game = await Game.findById(req.body.game_id);
    // Check if exist
    if (!game)
        return res.status(404).send(`Game ${req.body.game_id} was not found.`);
    let mathStat = await createNewStatsObject(req.body.child_id, req.body.game_id);
    // const games = await Game.find().sort('name');
    setGameToPlay(game.title);
    // setPlayerStatsObject(mathStat._id);
    // console.log(mathStat);
    res.status(200).send(mathStat);
});


async function createNewStatsObject(child_id, game_id) {
    let mathStat = await MathStat.findOne({
        child: child_id,
        game: game_id
    });
    // Response 400 Bad Request if the user exist
    if (!mathStat) { //return; //res.status(400).send("User already registered.");
        // Create new document
        mathStat = new MathStat({
            child: child_id,
            game: game_id,
            sheets: []
        });
    }
    // Save to DataBase
    await mathStat.save();

    return mathStat;
}


// Module exports
module.exports = router;