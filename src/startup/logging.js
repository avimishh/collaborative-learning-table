const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');


// TEST
// throw new Error('Something failed during startup.');
// const p = Promise.reject(new Error('something failed.'));
// p.then(() => console.log('done'));


// module.exports = function() {
//     winston.handleExceptions(
//         new winston.transports.Console({ colorize: true, prettyPrint: true }),
//         new winston.transports.File({ filename: 'uncaughtExceptions.log'})
//     );
    
//     process.on('uncaughtException', (ex) => {
//         // console.log('WE GOT AN UNCAUGHT EXCEPTION.');
//         winston.error(ex.message, ex);
//         process.exit(1);
//     });
    
//     process.on('unhandledRejection', (ex) => {
//         // console.log('WE GOT AN UNHANDLED REJECTION.');
//         // winston.error(ex.message, ex);
//         // process.exit(1);
//         throw ex;
//     });

//     // Log Errors
//     winston.add( new winston.transports.File( { filename: 'logfile.log' } ));
//     winston.add( new winston.transports.MongoDB( { db: 'mongodb://localhost/vidly' , level: 'info'} ));

// }



const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log` 
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' })
    ]
  });
   
//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}


module.exports = logger;