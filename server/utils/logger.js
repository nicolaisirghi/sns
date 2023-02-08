import winston from 'winston'
const {combine,timestamp,printf,colorize,align} = winston.format
export const logger = winston.createLogger(
{
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
      colorize({ all: true }),
      timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
      }),
      align(),
      printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`)
    ),
    transports: [new winston.transports.Console({ format: winston.format.combine(winston.format.colorize())}),
      new (winston.transports.File)({
        name: 'info-file',
        filename: 'filelog-info.log',
        level: 'info'
      }),
      new (winston.transports.File)({
        name: 'error-file',
        filename: 'filelog-error.log',
        level: 'error'
      })
    ],
  }   
)