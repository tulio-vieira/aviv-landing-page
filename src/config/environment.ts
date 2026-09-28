type Environment = "stage" | "prod";

interface EnvironmentConfig {
  siteUrl: string;
  basePath: string;
  allowIndexing: boolean;
  // GA4 Measurement ID ("G-XXXXXXXXXX"). null = no Google Analytics tag is rendered.
  gaMeasurementId: string | null;
}

const configs: Record<Environment, EnvironmentConfig> = {
  stage: {
    siteUrl: "https://tulio-vieira.github.io/aviv-landing-page",
    basePath: "/aviv-landing-page",
    allowIndexing: false,
    gaMeasurementId: null,
  },
  prod: {
    siteUrl: "https://aviveditorial.com.br",
    basePath: "",
    allowIndexing: true,
    // TODO: set the real GA4 Measurement ID (see "Google Analytics" in CLAUDE.md).
    gaMeasurementId: null,
  },
};

const environment: Environment =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "stage" ? "stage" : "prod";

// Bump this manually whenever a static asset in public/ is replaced, to bust browser caches (stage and prod).
const STATIC_ASSET_ID = "1";

export const environmentConfig = {
  ...configs[environment],
  staticAssetId: STATIC_ASSET_ID,
};

export function withBasePath(path: string): string {
  return `${environmentConfig.basePath}${path}?v=${environmentConfig.staticAssetId}`;
}
