import { handlerPath } from "@libs/handlerResolver";
import { addDailyReportSchema, noneSchema } from "../schema/dailyReportSchema";

export const addDailyReport = {
    handler: `${handlerPath(__dirname)}/dailyReportController.add`,
    events: [
        {
            http: {
                method: 'put',
                path: 'report/{userId}/{reportYear}/{reportMonth}/{reportDay}/new',
                request: {
                    parameters: {
                        paths: { userId: true, reportYear: true, reportMonth: true, reportDay: true }
                    },
                    schemas: {
                        'application/json': addDailyReportSchema,
                    }
                },
                authorizer: {
                    type: 'COGNITO_USER_POOLS',
                    authorizerId: {
                        Ref: 'cognitoAuthorizer'
                    }
                },
                localAuthorizer: {
                    type: 'request',
                    name: 'testAuthFnAllow'
                },
                cors: true
            }
        }
    ]
}

export const getDailyReport = {
    handler: `${handlerPath(__dirname)}/dailyReportController.get`,
    events: [
        {
            http: {
                method: 'get',
                path: 'report/{userId}/{reportYear}/{reportMonth}/{reportDay}/',
                request: {
                    parameters: {
                        paths: { userId: true, reportYear: true, reportMonth: true, reportDay: true }
                    },
                    schemas: {
                        'application/json': noneSchema,
                    }
                },
                authorizer: {
                    type: 'COGNITO_USER_POOLS',
                    authorizerId: {
                        Ref: 'cognitoAuthorizer'
                    }
                },
                localAuthorizer: {
                    type: 'request',
                    name: 'testAuthFnAllow'
                },
                cors: true
            }
        }
    ]
}
