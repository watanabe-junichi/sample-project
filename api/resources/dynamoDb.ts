export const transactionTable = {
    Type: 'AWS::DynamoDB::Table',
    Properties: {
        TableName: 'DailyReport_Transaction',
        AttributeDefinitions: [
            {AttributeName: 'userId', AttributeType: 'S'},
            {AttributeName: 'reportDateAndLineNo', AttributeType: 'S'},
            // {AttributeName: 'teamId', AttributeType: 'S'},
            // {AttributeName: 'projectId', AttributeType: 'S'},
            // {AttributeName: 'content', AttributeType: 'S'},
            // {AttributeName: 'workTime', AttributeType: 'N'},
            // {AttributeName: 'saveAt', AttributeType: 'S'},
            // {AttributeName: 'approve', AttributeType: 'S'},
            // {AttributeName: 'approveAt', AttributeType: 'S'},
            // {AttributeName: 'approveUserId', AttributeType: 'S'},
        ],
        KeySchema: [
            {AttributeName: 'userId', KeyType: 'HASH'},
            {AttributeName: 'reportDateAndLineNo', KeyType: 'RANGE'}
        ],
        ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 1
        }
    }
}

