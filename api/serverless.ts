import type { AWS } from '@serverless/typescript';
import { transactionTable } from '@resources/dynamoDb'
import { cognitoUserPool, cognitoUserPoolClient } from '@resources/cognito'
import { cognitoAuthorizer } from '@resources/apiGatewayAuthorizer'
import hello from '@functions/hello';
import { addDailyReport, getDailyReport } from '@functions/daily-report/controller';

const serverlessConfiguration: AWS = {
  service: 'serverless-sample1',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline-local-authorizers-plugin', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',

    stage: '${self:custom.stage}',
    region: 'ap-northeast-1',
    profile: '${self:custom.profiles.${self:custom.stage}}',

    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    hello,
    addDailyReport,
    getDailyReport
  },

  package: { individually: true },

  custom: {
    defaultStage: 'dev',
    stage: '${opt:stage, self:custom.defaultStage}',
    profiles: {
      dev: 'DEV_daily-report',
      staging: 'STG_daily-report',
      prod: 'PROD_daily-report',
    },

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },

    dynamodb: {
      stages: 'dev',
      start: {
        dbPath: '.dynamodb-local/',
        migrate: true,
      }
    }
  },

  resources: {
    Resources: {
      transactionTable: transactionTable,
      cognitoUserPool: cognitoUserPool,
      cognitoUserPoolClient: cognitoUserPoolClient,
      cognitoAuthorizer: cognitoAuthorizer,
    }
  },
};

module.exports = serverlessConfiguration;
