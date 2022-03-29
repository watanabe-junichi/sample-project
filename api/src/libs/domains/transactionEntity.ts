export interface IDailyReportDetailEntity {
    lineNo: number
    projectId: string
    workTime?: number
    workContent: string
    saveAt: string
}

export interface IDailyReportEntity {
    userId: string
    reportDate: Date
    teamId: string
    reportDetail: IDailyReportDetailEntity[]
    approve: boolean
    approveAt?: string
    approveUserId?: string
}
