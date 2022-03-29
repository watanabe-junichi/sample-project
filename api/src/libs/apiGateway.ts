import { Logger } from '@libs/logger'
import { AWSError } from 'aws-sdk'

import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda"
import type { FromSchema } from "json-schema-to-ts";

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>

export const formatJSONResponse = async (response: Record<string, unknown>, statusCode = 200) => {
  const logger = await new Logger('APIGateway').getLogger()
  const res = {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
    },
    body: JSON.stringify(response)
  }
  logger.info(JSON.stringify(res))
  return res
}

export interface IErrorResponseBody {
  /**
   * Sample
   * ```
   * {
   *  "code": authentication,
   *  "message": "Bad authentication token",
   *  "info": "https://docs.example.com/api/v1/authentication"
   * }
   ```
   */
  code: string
  message: string
  info?: string
}

const makeErrorResponseBody = (err: unknown): IErrorResponseBody => {
  const msg = err instanceof Error ? err.message : ''
  const code = (err as AWSError).code !== undefined ? (err as AWSError).code : ''
  return {
    code: code,
    message: msg
  }
}

export const ErrorResponse = async (err: unknown) => {
  const statusCode = (err as AWSError).statusCode !== undefined ? (err as AWSError).statusCode : 500
  const error = makeErrorResponseBody(err)
  return formatJSONResponse({ error }, statusCode)
}
