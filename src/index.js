// Express App
const express = require("express");
const app = express();

// START UP
const logger = require("./startup/logging.js");
// Debug
if (app.get("env") === "development") {
  require("./startup/debug")(app);
}

// moved to here for debug comfort. need to use it inside startup/routes
const publicPath = `${__dirname}/./../client/`;
app.use("/", express.static(publicPath));

require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

// app.get('/', async (req,res) =>{
//     res.sendFile(__dirname + '/home.html');
// });

// Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

logger.info("Application Server Is Up!");

if (app.get("env") !== "test") {
  require("./startup/socketio")(server, app);
}

module.exports = server;
