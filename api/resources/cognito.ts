import { mailConfig } from '@resources/mailConfig'
import { getEnv } from '@libs/helpers/env'

const env = getEnv()

export const cognitoUserPool = {
    Type: 'AWS::Cognito::UserPool',
    Properties: {
        AdminCreateUserConfig: {
            AllowAdminCreateUserOnly: true,
            InviteMessageTemplate: {
                EmailMessage: mailConfig.body.user,
                EmailSubject: mailConfig.subject.user
            }
        },
        AutoVerifiedAttributes: ['email'],
        EmailConfiguration : mailConfig.EmailConfiguration[`${env}`],
        EmailVerificationMessage: mailConfig.body.verification,
        EmailVerificationSubject: mailConfig.subject.verification,
        MfaConfiguration: 'OFF',
        Policies : {
            PasswordPolicy : {
                MinimumLength: 8,
                RequireLowercase: true,
                RequireUppercase: true,
                RequireNumbers: true,
                RequireSymbols: false,
                TemporaryPasswordValidityDays: 7
            }
        },
        Schema : [{
            AttributeDataType: 'String',
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: 'organizationId'
        }],
        UsernameAttributes: ['email'],
        UsernameConfiguration: {
            CaseSensitive: true
        },
        UserPoolAddOns : {
            AdvancedSecurityMode: 'AUDIT'
        },
        UserPoolName: '${self:service}-${self:custom.stage}-user',
    }
}

export const cognitoUserPoolClient = {
    Type: 'AWS::Cognito::UserPoolClient',
    Properties : {
        ClientName : '${self:service}-${self:custom.stage}-user-pool-client',
        ExplicitAuthFlows: [
            'ALLOW_USER_PASSWORD_AUTH',
            'ALLOW_ADMIN_USER_PASSWORD_AUTH',
            'ALLOW_USER_SRP_AUTH',
            'ALLOW_REFRESH_TOKEN_AUTH'
        ],
        GenerateSecret: false,
        PreventUserExistenceErrors: 'ENABLED',
        ReadAttributes: [
            'email',
            'name',
            'custom:organizationId'
        ],
        RefreshTokenValidity: 7,
        SupportedIdentityProviders: ['COGNITO'],
        UserPoolId: {
            Ref: 'cognitoUserPool'
        },
        WriteAttributes: [
            'email', 
            'name',
            'custom:organizationId'
        ]
    }
}

