import * as winston from 'winston'

export class Logger {
  private logger: winston.Logger | undefined

  constructor(service = 'Unspecified service') {
    this.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      ),
      defaultMeta: { service: service },
      transports: new winston.transports.Console()
    })
  }

  public async getLogger(): Promise<winston.Logger> {
    return this.logger
  }

  // public async initialize(service = 'Unspecified service'): Promise<winston.Logger> {
  //   return this.syncInitialize(service)
  // }

  // public syncInitialize(service = 'Unspecified service'): winston.Logger | undefined {
  //   this.logger = winston.createLogger({
  //     level: 'info',
  //     format: winston.format.combine(
  //       winston.format.timestamp({
  //         format: 'YYYY-MM-DD HH:mm:ss'
  //       }),
  //       winston.format.errors({ stack: true }),
  //       winston.format.splat(),
  //       winston.format.json()
  //     ),
  //     defaultMeta: { service: service },
  //     transports: new winston.transports.Console()
  //   })

  //   return this.logger
  // }

}
