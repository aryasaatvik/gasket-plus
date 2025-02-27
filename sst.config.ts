/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "gasket-nextjs",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
      providers: {
        cloudflare: {
          version: "5.40.0",
          apiToken: process.env.CLOUDFLARE_API_TOKEN,
        },
      },
    };
  },
  async run() {
    const nextjs = new sst.aws.Nextjs("GasketNextJS", {
      path: "apps/gasket-nextjs",
      buildCommand: "pnpm run build:open-next",
      domain: {
        name: "gasket.arya.sh",
        dns: sst.cloudflare.dns()
      },
      environment: {
        GASKET_ENV: "production",
        NEXT_PUBLIC_URL: 'https://gasket.arya.sh'
      },
      transform: {
        server: {
          runtime: "nodejs22.x"
        },
        imageOptimization: {
          runtime: "nodejs22.x"
        }
      }
    });

    const honoLambda = new sst.aws.Function("GasketHonoLambda", {
      handler: "apps/hono-api-lambda/lambda.handler",
      runtime: "nodejs22.x",
      url: true,
      environment: {
        GASKET_ENV: "production",
      }
    })

    return {
      nextjs: $dev ? 'http://localhost:3000' : nextjs.url,
      honoLambda: honoLambda.url,
    };
  },
});
