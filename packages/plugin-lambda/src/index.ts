import type { Plugin } from '@gasket/core';
import type { APIGatewayProxyEvent, APIGatewayProxyEventV2, APIGatewayProxyResult, Context } from 'aws-lambda';
import { name, version, description } from '../package.json';
import createHandler from './actions/create-handler.js';

export type LambdaEvent = APIGatewayProxyEvent | APIGatewayProxyEventV2;
type LambdaHandler = (event: LambdaEvent, context?: Context) => Promise<APIGatewayProxyResult>;

declare module '@gasket/core' {
  export interface GasketConfig {
    lambda?: {
      /** Enable/disable request logging */
      logger?: boolean;
      /** Configure CORS headers */
      cors?: {
        allowOrigin?: string;
        allowMethods?: string;
        allowHeaders?: string;
      };
      /** Additional Lambda configuration options */
      [key: string]: unknown;
    };
    [key: string]: any;
  }

  export interface GasketActions {
    createHandler?: () => MaybeAsync<MaybeMultiple<(event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>>>;
  }

  export interface HookExecTypes {
    create(context: any): MaybeAsync<void>;
    lambdaMiddleware(handler: LambdaHandler):
      MaybeAsync<MaybeMultiple<(event: APIGatewayProxyEvent, context: Context, next: () => Promise<void>) => Promise<void>>>;
    lambda(handler: LambdaHandler): MaybeAsync<LambdaHandler>
    lambdaErrorMiddleware():
      MaybeAsync<MaybeMultiple<(err: Error, event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>>>;
    metadata(meta: any): MaybeAsync<any>;
  }
}

declare module 'create-gasket-app' {
  interface CreateContext {
    lambdaApp?: boolean;
    addLambdaRoutes?: boolean;
  }
}

const pluginLambda: Plugin = {
  name,
  version,
  description,
  actions: {
    createHandler
  },
  hooks: {
    metadata(gasket, meta) {
      return {
        ...meta,
        guides: [{
          name: 'Lambda Setup Guide',
          description: 'Setting up AWS Lambda handlers with Gasket',
          link: 'docs/setup.md'
        }],
        lifecycles: [{
          name: 'lambdaMiddleware',
          method: 'exec',
          description: 'Add middleware to the Lambda handler',
          link: 'README.md#lambdaMiddleware',
          parent: 'createHandler'
        }, {
          name: 'lambda',
          method: 'exec',
          description: 'Modify the Lambda handler instance',
          link: 'README.md#lambda',
          parent: 'createHandler',
          after: 'lambdaMiddleware'
        }, {
          name: 'lambdaErrorMiddleware',
          method: 'exec',
          description: 'Add error handling middleware to the Lambda handler',
          link: 'README.md#lambdaErrorMiddleware',
          parent: 'createHandler',
          after: 'lambda'
        }],
        configurations: [{
          name: 'lambda',
          link: 'README.md#configuration',
          description: 'Lambda plugin configuration',
          type: 'object'
        }]
      };
    }
  }
};

export default pluginLambda;