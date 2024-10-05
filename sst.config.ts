/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "gasket-nextjs",
      removal: input?.stage === "prod" ? "retain" : "remove",
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
    new sst.aws.Nextjs("GasketNextJS", {
      buildCommand: "pnpm run build:open-next",
      domain: {
        name: "gasket.arya.sh",
        dns: sst.cloudflare.dns()
      }
    });
  },
});
