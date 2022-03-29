export class CustomError extends Error {
    constructor(public statusCode: number, public code: string, e?: string) {
      super(e)
      this.name = new.target.name
  
      // Maintains proper stack trace for where our error was thrown (only available on V8)
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor)
      }
    }
  }

  export const errors = {
    metadata: {
      version: 1.0
    },
    Validation: {
      UnknownEnv: {
        statusCode: 500,
        code: 'UnknownEnvException',
        message: 'Stage is not defined in process.env'
      },
      BadRequest: {
        UnknownEventException: {
          statusCode: 500,
          code: 'UnknownEventException',
          message: 'Unexpected event is coming!!!'
        },
        PropertyException: {
          statusCode: 400,
          code: 'PropertyException',
          message: 'Invalid request body.'
        },
        DateFormatException: {
          statusCode: 400,
          code: 'DateFormatException',
          message: 'Invalid request body.'
        }
      }
    },
    Service: {
      Cognito: {
        CreateException: {
          statusCode: 500,
          code: 'CognitoCreateException',
          message: 'Cognitoのユーザ作成に失敗しました。'
        }
      },
      SecretManager: {
        NotFoundException: {
          statusCode: 404,
          code: 'NotFoundException',
          message: 'Secretが取得できません。'
        }
      },
    }
  }
  