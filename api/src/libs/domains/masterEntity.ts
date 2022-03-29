
export interface IUserEntity {
    userId: string
    employeeNumber: string
    name: string
    teamIds?: string[]
    projectIds?: string[]
}

export interface ITeamEntity {
    teamId: string
    teamName: string
    memberIds?: string[]
}

export interface IProjectEntity {
    projectId: string
    projectName: string
    projectSummary: string
    memberIds?: string[]
}
