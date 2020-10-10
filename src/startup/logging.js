const winston = require("winston");
const {createLogger, transports } = winston
const { combine, timestamp, printf, prettyPrint } = winston.format;
require("express-async-errors");

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] [${level}]: ${message}`;
});

const logger = createLogger({
  level: "http",
  format: combine(timestamp(), prettyPrint(), myFormat),
  // format: winston.format.json(),
  // defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({
      filename: "./log/error.log",
      level: "error",
    }),
    new transports.Console({ level: "error" }),
    new transports.File({ filename: "./log/combined.log" }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: "./log/exceptions.log" }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: "./log/rejections.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: combine(timestamp(), prettyPrint(), myFormat),
      level: "info",
    })
  );
}

module.exports = logger;