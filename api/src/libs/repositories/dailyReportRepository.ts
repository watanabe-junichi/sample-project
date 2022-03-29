import { IDailyReportEntity } from "@libs/domains/transactionEntity";
import { IMultiKeyBaseRepository } from "./baseRepository";

export interface IDailyReportRepository extends IMultiKeyBaseRepository<IDailyReportEntity> {

    findByPrimaryKey(userId: string, reportDate: Date): Promise<IDailyReportEntity>

    findByProjectAndMonth(projectId: string, reportYearMonth: string): Promise<IDailyReportEntity[]>

    findByTeamAndMonth(teamId: string, reportYearMonth: string): Promise<IDailyReportEntity[]>

}
