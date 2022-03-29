
export const cognitoAuthorizer = {
    Type: 'AWS::ApiGateway::Authorizer',
    // DependsOn: 'ApiGatewayRestApi',
    Properties: {
        Name: 'cognitoAuthorizer',
        RestApiId: {
            Ref: 'ApiGatewayRestApi',
        },
        IdentitySource: 'method.request.header.Authorization',
        Type: 'COGNITO_USER_POOLS',
        ProviderARNs: [{
            'Fn::GetAtt': [
                'cognitoUserPool',
                'Arn'
            ]
        }]
    }
}
