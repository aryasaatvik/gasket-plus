import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import type { Gasket } from '@gasket/core';
import { LambdaEvent } from '../index.js';

/**
 * Creates a Lambda handler function that can be used with AWS Lambda
 *
 * @param {Gasket} gasket - The Gasket instance
 * @returns {Function} Lambda handler function
 */
export default async function createHandler(gasket: Gasket) {
  await gasket.isReady;
  const config = gasket.config.lambda || {};

  // default handler function
  let handler = async (event: LambdaEvent, context?: Context): Promise<APIGatewayProxyResult> => {
    try {
      // Default response
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: 'Hello from Lambda!' })
      };
    } catch (error) {
      console.error('Error in Lambda handler:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Internal Server Error' })
      };
    }
  };

  // Apply middleware
  const middlewares = await gasket.exec('lambdaMiddleware', handler);

  // Apply custom handler logic
  handler = await gasket.execWaterfall('lambda', handler);

  // Apply error middleware
  const errorMiddlewares = await gasket.exec('lambdaErrorMiddleware');

  // Create the final handler function
  const finalHandler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
    try {
      // Add CORS headers if configured
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (config.cors) {
        if (config.cors.allowOrigin) {
          headers['Access-Control-Allow-Origin'] = config.cors.allowOrigin;
        }
        if (config.cors.allowMethods) {
          headers['Access-Control-Allow-Methods'] = config.cors.allowMethods;
        }
        if (config.cors.allowHeaders) {
          headers['Access-Control-Allow-Headers'] = config.cors.allowHeaders;
        }
      }

      // Log request if enabled
      if (config.logger !== false) {
        console.log('Lambda event:', JSON.stringify(event));
      }

      // Execute middleware chain
      let result = await handler(event, context);

      // Add headers to response
      result.headers = { ...headers, ...result.headers };

      return result;
    } catch (error) {
      // Handle errors with error middleware if available
      for (const errorMiddleware of errorMiddlewares.filter(Boolean)) {
        if (typeof errorMiddleware === 'function') {
          try {
            return await errorMiddleware(error as Error, event, context);
          } catch (middlewareError) {
            console.error('Error in error middleware:', middlewareError);
          }
        }
      }

      // Default error response
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ error: 'Internal Server Error' })
      };
    }
  };

  return finalHandler;
}