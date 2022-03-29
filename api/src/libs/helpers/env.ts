import { CustomError, errors } from '@libs/error'

type IEnv = 'dev' | 'stg' | 'prod'

export const getEnv = (): IEnv => {
  if (typeof process.env.STAGE === undefined) {
    const e = errors.Validation.UnknownEnv
    throw new CustomError(e.statusCode, e.code, e.message)
  } else {
    return process.env.STAGE as IEnv
  }
}

export const getEnvUpperCamel = (): string => {
  if (getEnv() === 'dev') return 'Dev'
  if (getEnv() === 'stg') return 'Stg'
  if (getEnv() === 'prod') return 'Prod'

  const e = errors.Validation.UnknownEnv
  throw new CustomError(e.statusCode, e.code, e.message)
}
