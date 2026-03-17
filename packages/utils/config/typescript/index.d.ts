declare module '@leao1/config' {
  interface GenerateConfig {
    leao: object;
    pwd: string;
    rootDir?: string;
    artifacts?: { contentTypes?: boolean; components?: boolean; services?: boolean; controllers?: boolean; policies?: boolean; middlewares?: boolean };
    logger?: { silent?: boolean; debug?: boolean; verbose?: boolean };
  }

  const utils: {
    compile: (srcDir: string, options?: { configOptions?: Record<string, unknown> }) => Promise<void>;
    compilers: unknown;
    generators: { generate: (config?: GenerateConfig) => Promise<Record<string, unknown>> };
    isUsingTypeScript: (dir: string) => Promise<boolean>;
    isUsingTypeScriptSync: (dir: string) => boolean;
    getConfigPath: (dir: string) => string;
    reportDiagnostics: unknown;
    resolveConfigOptions: unknown;
    formatHost: unknown;
    resolveOutDir: (dir: string, configFilename?: string) => Promise<string | undefined>;
  };
  export = utils;
}
