import { IDailyReportDetailEntity, IDailyReportEntity } from "@libs/domains/transactionEntity";
import { Logger } from "@libs/logger";
import DailyReportRepositoryByAWSDynamoDBImpl from "@libs/repositories/awsImpl/dynamoDbImpl";
import { IDailyReportRepository } from "@libs/repositories/dailyReportRepository";

export class DailyReportUsecase {

    private readonly dailyReportRepository: IDailyReportRepository

    constructor() {
        this.dailyReportRepository = new DailyReportRepositoryByAWSDynamoDBImpl()
    }

    public getDailyReport = async (userId: string, reportDate: Date): Promise<IDailyReportEntity> => {
        return await this.dailyReportRepository.findByPrimaryKey(userId, reportDate)
    }

    public addDailyReport = async (userId: string, reportDate: Date, reportDetail: IDailyReportDetailEntity[]) => {
        const logger = await new Logger('UseCase').getLogger()
        logger.debug('Call addDailyReport Method.')

        // TODO: Get User's Team
        const teamId: string = 'TEST-TEAM'
        const dailyReport: IDailyReportEntity = {
            userId: userId,
            reportDate: reportDate,
            reportDetail: reportDetail,
            teamId: teamId,
            approve: false,
        }
        await this.dailyReportRepository.save(dailyReport)
    }

}
