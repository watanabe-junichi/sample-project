/* API Gateway の validation でできないvalidate */
import { CustomError, errors } from '@libs/error'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { FromSchema } from 'json-schema-to-ts'

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> }

export const getMandatoryPathParameter = (event: ValidatedAPIGatewayProxyEvent<object>, param: string): string => {
  const e = errors.Validation.BadRequest.UnknownEventException
  if (!event.pathParameters) throw new CustomError(e.statusCode, e.code, e.message)

  const key = param as keyof typeof event.pathParameters
  if (event.pathParameters[key] === undefined) {
    throw new CustomError(e.statusCode, e.code, e.message)
  } else {
    return event.pathParameters[key] as string
  }
}

export const getMandatoryQueryParameter = (event: ValidatedAPIGatewayProxyEvent<object>, param: string): string => {
  const e = errors.Validation.BadRequest.UnknownEventException
  if (!event.queryStringParameters) throw new CustomError(e.statusCode, e.code, e.message)

  const key = param as keyof typeof event.queryStringParameters
  if (event.queryStringParameters[key] === undefined) {
    throw new CustomError(e.statusCode, e.code, e.message)
  } else {
    return event.queryStringParameters[key] as string
  }
}
