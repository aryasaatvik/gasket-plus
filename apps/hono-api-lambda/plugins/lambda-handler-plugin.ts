import { Plugin } from "@gasket/core";
import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

const pluginLambdaHandler: Plugin = {
  name: 'lambda-handler',
  hooks: {
    // @ts-expect-error - TODO: fix this
    lambda: async (gasket, handler) => {
      const hono = new Hono();
      await gasket.exec('hono', hono);
      return handle(hono);
    }
  }
};

export default pluginLambdaHandler;