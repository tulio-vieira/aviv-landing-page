type Environment = "stage" | "prod";

interface EnvironmentConfig {
  siteUrl: string;
  basePath: string;
  allowIndexing: boolean;
}

const configs: Record<Environment, EnvironmentConfig> = {
  stage: {
    siteUrl: "https://tulio-vieira.github.io/aviv-landing-page",
    basePath: "/aviv-landing-page",
    allowIndexing: false,
  },
  prod: {
    siteUrl: "https://www.avivsdg.com.br",
    basePath: "",
    allowIndexing: true,
  },
};

const environment: Environment =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "stage" ? "stage" : "prod";

export const environmentConfig = configs[environment];

export function withBasePath(path: string): string {
  return `${environmentConfig.basePath}${path}`;
}
