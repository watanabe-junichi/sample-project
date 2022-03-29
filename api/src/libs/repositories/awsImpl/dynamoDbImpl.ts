import { IDailyReportDetailEntity, IDailyReportEntity } from "@libs/domains/transactionEntity";
import { Logger } from "@libs/logger";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
// import { tmpdir } from "os";
import { env, report } from "process";
import { IDailyReportRepository } from "../dailyReportRepository";

const region: string = 'ap-northeast-1'
let options = undefined
if (env.IS_OFFLINE) {
    options = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    }
} else {
    options = {
        region: region
    }
}
const ddbClient: DocumentClient = new DocumentClient(options)

// type getItemInput = DocumentClient.GetItemInput
type queryInput = DocumentClient.QueryInput
type putItemInput = DocumentClient.PutItemInput
type putItemInputAttributeMap = DocumentClient.PutItemInputAttributeMap
// type getItemOutput = DocumentClient.GetItemOutput
type queryOutput = DocumentClient.QueryOutput
type putItemOutput = DocumentClient.PutItemOutput
type AttributeMap = DocumentClient.AttributeMap

export default class DailyReportRepositoryByAWSDynamoDBImpl implements IDailyReportRepository {

    private readonly tableName: string
    private readonly logging: Logger

    constructor() {
        this.tableName = 'DailyReport_Transaction'
        this.logging = new Logger('DailyReportRepositoryByAWSDynamoDBImpl')
    }

    public findByPrimaryKey = async (userId: string, reportDate: Date): Promise<IDailyReportEntity | null> => {
        const logger = await this.logging.getLogger()

        // Find DynamoDb
        const params: queryInput = {
            TableName: this.tableName,
            KeyConditionExpression: "userId = :userId and begins_with(reportDateAndLineNo, :reportDate)",
            ExpressionAttributeValues: {
                ':userId': userId,
                ':reportDate': `${reportDate.getFullYear()}${String(reportDate.getMonth() + 1).padStart(2, '0')}${String(reportDate.getDay()).padStart(2, '0')}`,
            }
        }
        const result: queryOutput = await ddbClient.query(params).promise()
        logger.info(`get response: ${JSON.stringify(result)}`)

        // Convert Result
        if (result.Count > 0) {
            return this.convertAttributeMapToEntity(result.Items)
        } else {
            return null
        }

    }

    public findAll = async (): Promise<IDailyReportEntity[]> => {
        return []
    }

    public findByTeamAndMonth = async (teamId: string, reportYearMonth: string): Promise<IDailyReportEntity[]> => {
        return []
    }

    public findByProjectAndMonth = async (projectId: string, reportYearMonth: string): Promise<IDailyReportEntity[]> => {
        return []
    }

    public save = async (entity: IDailyReportEntity): Promise<IDailyReportEntity> => {
        const logger = await this.logging.getLogger()
        logger.debug(`Call save Method(${entity})`)

        for (const detail of entity.reportDetail) {
            // put item
            const convertItem = await this.convertEntityToAttributeMap(entity, detail)
            const params: putItemInput = {
                TableName: this.tableName,
                Item: convertItem
            }
            logger.debug(params)
            const result: putItemOutput = await ddbClient.put(params).promise()
            logger.info(`put response: ${JSON.stringify(result)}`)
        }

        return entity
    }

    public update = async (entity: IDailyReportEntity): Promise<IDailyReportEntity> => {
        return entity
    }

    // ---------------------------------------------------- Private Method Area
    private createDailyReportSortKey = async (reportDate: Date, lineNo: number): Promise<string> => {
        return `${reportDate.getFullYear()}${String(reportDate.getMonth() + 1).padStart(2, '0')}${String(reportDate.getDay()).padStart(2, '0')}${String(lineNo).padStart(3,'0')}`
    }

    private splitDailyReportSortKey = async (reportDateAndLineNo: string): Promise<[reportDate: Date, lineNo: number]> => {
        const reportDate: Date = new Date(Number(reportDateAndLineNo.substring(0, 4)),
                                          Number(reportDateAndLineNo.substring(4, 2)),
                                          Number(reportDateAndLineNo.substring(6, 2)))
        const lineNo: number = Number(reportDateAndLineNo.substring(8))
        return [reportDate, lineNo]
    }

    private convertAttributeMapToEntity = async (items: AttributeMap[]): Promise<IDailyReportEntity> => {
        const firstItem: AttributeMap = items[0]
        let reportDetail: IDailyReportDetailEntity[] = []
        for (const item of items) {
            const splitReportDateAndLineNo: [Date, number] = await this.splitDailyReportSortKey(item.reportDateAndLineNo)
            reportDetail.push({
                lineNo: splitReportDateAndLineNo[1],
                projectId: item.projectId,
                workContent: item.content,
                workTime: item.workTime,
                saveAt: item.saveAt
            })
        }
        const tmp: IDailyReportEntity = {
            userId: firstItem.userId,
            reportDate: await this.splitDailyReportSortKey(firstItem.reportDateAndLineNo)[0],
            teamId: firstItem.teamId,
            reportDetail: reportDetail,
            approve: firstItem.approve,
            approveAt: firstItem.approveAt,
            approveUserId: firstItem.approveUserId
        }
        return tmp
    }

    private convertEntityToAttributeMap = async (entity: IDailyReportEntity, detail: IDailyReportDetailEntity): Promise<putItemInputAttributeMap> => {
        const tmp: putItemInputAttributeMap = {
            userId: entity.userId,
            reportDateAndLineNo: await this.createDailyReportSortKey(entity.reportDate, detail.lineNo),
            workTime: detail.workTime,
            workContent: detail.workContent,
            saveAt: detail.saveAt,
            projectId: detail.projectId,
            teamId: entity.teamId,
            approve: entity.approve,
            approveAt: entity.approveAt,
            approveUserId: entity.approveUserId
        }
        return tmp
    }

}
