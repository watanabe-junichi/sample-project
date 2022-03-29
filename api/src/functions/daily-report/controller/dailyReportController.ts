import { formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from "@libs/apiGateway";
import { getMandatoryPathParameter } from "@libs/helpers/validation";
import { Logger } from "@libs/logger";
import { ErrorResponse } from "@libs/apiGateway"
import { noneSchema, addDailyReportSchema } from "@functions/daily-report/schema/dailyReportSchema";
import { middyfy } from "@libs/lambda";
import { DailyReportUsecase } from "@libs/usecases/dailyReportUsecase";
import { IDailyReportDetailEntity, IDailyReportEntity } from "@libs/domains/transactionEntity";

const addDailyReport: ValidatedEventAPIGatewayProxyEvent<typeof addDailyReportSchema> = async (event) => {
    const logger = await new Logger('Controller').getLogger()
    logger.info(`event: ${JSON.stringify(event)}`)

    try {
        // Get Parameter Values.
        const userId: string = getMandatoryPathParameter(event, 'userId')
        const reportYear: number = Number(getMandatoryPathParameter(event, 'reportYear'))
        const reportMonth: number = Number(getMandatoryPathParameter(event, 'reportMonth'))
        const reportDay: number = Number(getMandatoryPathParameter(event, 'reportDay'))
        const reportDate: Date = new Date(reportYear, reportMonth - 1, reportDay)
        logger.debug(`${userId} - ${reportDate}`)

        let reportDetail: IDailyReportDetailEntity[] = []
        const nowDate = new Date()
        for (const detail of event.body.details) {
            reportDetail.push({
                lineNo: detail.lineNo,
                projectId: detail.projectId,
                workTime: detail.workTime,
                workContent: detail.content,
                saveAt: nowDate.toISOString()
            })
        }
        logger.debug(reportDetail)

        // Call Usecase Logic.
        const uc = new DailyReportUsecase()
        await uc.addDailyReport(userId, reportDate, reportDetail)
        return formatJSONResponse({})

    } catch(err) {
        logger.debug(err)
        return await ErrorResponse(err)
    }
}

const getDailyReport: ValidatedEventAPIGatewayProxyEvent<typeof noneSchema> = async (event) => {
    const logger = await new Logger('Controler').getLogger()
    logger.info(`event: ${JSON.stringify(event)}`)

    try {
        // Get Parameter Values.
        const userId: string = getMandatoryPathParameter(event, 'userId')
        const reportYear: number = Number(getMandatoryPathParameter(event, 'reportYear'))
        const reportMonth: number = Number(getMandatoryPathParameter(event, 'reportMonth'))
        const reportDay: number = Number(getMandatoryPathParameter(event, 'reportDay'))
        const reportDate: Date = new Date(reportYear, reportMonth - 1, reportDay)
        logger.debug(`${userId} - ${reportDate}`)

        // Call Usecase Logic.
        const uc = new DailyReportUsecase()
        const result: IDailyReportEntity = await uc.getDailyReport(userId, reportDate)        
        return formatJSONResponse({ result })

    } catch(err) {
        return await ErrorResponse(err)
    }
}

export const get = middyfy(getDailyReport)
export const add = middyfy(addDailyReport)
