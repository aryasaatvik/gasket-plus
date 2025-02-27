import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { handle } from 'hono/aws-lambda';
import type { Plugin } from '@gasket/core';
import type { APIGatewayProxyResult } from 'aws-lambda';

// Declare the hook type to fix linter errors
declare module '@gasket/core' {
  export interface HookExecTypes {
    lambda(handler: (event: any, context: any) => Promise<APIGatewayProxyResult>): 
      Promise<(event: any, context: any) => Promise<APIGatewayProxyResult>>;
    hono(app: Hono): Promise<void>;
  }
}

/**
 * Hono integration plugin for Gasket Lambda
 */
const honoPlugin: Plugin = {
  name: 'lambda-handler',
  hooks: {
    /**
     * Replace the Lambda handler with a Hono app
     * 
     * @param {object} gasket - The Gasket instance
     * @param {Function} handler - The Lambda handler
     */
    lambda: async (gasket, handler) => {
      // Create a new Hono app
      const hono = new Hono();

      // Add middleware
      hono.use('*', logger());
      hono.use('*', cors());

      // Allow other plugins to add routes to the Hono app
      await gasket.exec('hono', hono);

      // Return Hono's Lambda handler
      return handle(hono);
    }
  }
};

export default honoPlugin; 