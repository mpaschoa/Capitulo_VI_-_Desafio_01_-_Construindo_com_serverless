import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serverless-challenge',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: {
    listToDo: {
      handler: 'src/functions/listToDo.handler',
      events: [
        {
          http: {
            path: 'listToDo/{userid}',
            method: 'get',
            cors: true,
          },
        },
      ],
    },
    createToDo: {
      handler: 'src/functions/createToDo.handler',
      events: [
        {
          http: {
            path: 'createToDo/{userid}',
            method: 'post',
            cors: true,
          },
        },
      ],
    },    
  },
  package: { individually: true },
  custom: {
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
      stages: ['dev', 'local'],
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
    },    
  },
  resources: {
    Resources: {
      dbToDo: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: 'to_do',
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5,
          },
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'S',
            },             
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
        },
      },
    },
  },      
};

module.exports = serverlessConfiguration;
