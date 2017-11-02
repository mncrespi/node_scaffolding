import winston                  from 'winston'
import config                   from './env'

export default new winston.Logger({
  level: config.logger.level,
  levels: winston.config.syslog.levels,
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: true,
      prettyPrint: config.logger.prettyPrint,
    }),
    new (winston.transports.File)({
      filename: config.logger.logFile,
    }),
  ],
})
