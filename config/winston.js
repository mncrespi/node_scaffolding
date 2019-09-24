import winston from 'winston'
import config from './env/index.js'

/*
TODO: Create and Move to generic and configurable logger module
Code For Winston 3
Ref: https://github.com/winstonjs/winston/blob/master/README.md
Ref: https://github.com/winstonjs/winston/issues/1336
*/

export default winston.createLogger({
  level: config.logger.level,
  levels: winston.config.syslog.levels,
  format: winston.format.combine(
    winston.format.splat(),
    winston.format.simple(),
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.prettyPrint(),
    winston.format.json(),
    winston.format.printf((info) => {
      return Object.keys(info).reverse().reduce((acc, key, i) => {
        if (typeof key === 'string') {
          if (i > 0) acc += ', '
          acc += `${key}: ${info[key]}`
        }
        return acc
      }, '')
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: config.logger.file, }),
    // new winston.transports.File({ filename: 'error.log', level: 'error', }),
  ],
})