export const noneSchema = {} as const

export const addDailyReportSchema = {
    type: 'object',
    properties: {
        details: {
            type: 'array',
            minItems: 1,
            items: {
                type: 'object',
                properties: {
                    lineNo: { type: 'number' },
                    content: { type: 'string' },
                    projectId: { type: 'string' },
                    workTime: { type: 'number' },
                },
                required: ['lineNo', 'content', 'projectId'],
                additionalProperties: false
            }
        }
    },
    additionalProperties: false
} as const
