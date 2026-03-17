import type { InlineConfig, UserConfig } from 'vite';
import browserslistToEsbuild from 'browserslist-to-esbuild';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

import { getUserConfig } from '../core/config';
import { loadLeaoMonorepo } from '../core/monorepo';
import { getMonorepoAliases } from '../core/aliases';
import type { BuildContext } from '../create-build-context';
import { buildFilesPlugin } from './plugins';

const resolveBaseConfig = async (ctx: BuildContext): Promise<InlineConfig> => {
  const target = browserslistToEsbuild(ctx.target);

  return {
    root: ctx.cwd,
    build: {
      emptyOutDir: false, // Rely on CLI to do this
      outDir: ctx.distDir,
      target,
    },
    cacheDir: 'node_modules/.leao/vite',
    configFile: false,
    define: {
      'process.env': ctx.env,
    },
    envPrefix: 'LEAO_ADMIN_',
    optimizeDeps: {
      include: [
        // pre-bundle React dependencies to avoid React duplicates,
        // even if React dependencies are not direct dependencies
        // https://react.dev/warnings/invalid-hook-call-warning#duplicate-react
        'react',
        `react/jsx-runtime`,
        'react-dom/client',
        'styled-components',
        'react-router-dom',
      ],
    },
    resolve: {
      // https://react.dev/warnings/invalid-hook-call-warning#duplicate-react
      dedupe: ['react', 'react-dom', 'react-router-dom', 'styled-components'],
    },
    plugins: [react(), tailwindcss(), buildFilesPlugin(ctx)],
  };
};

const resolveProductionConfig = async (ctx: BuildContext): Promise<InlineConfig> => {
  const {
    options: { minify, sourcemaps },
  } = ctx;

  const baseConfig = await resolveBaseConfig(ctx);

  return {
    ...baseConfig,
    base: ctx.basePath,
    logLevel: 'silent',
    mode: 'production',
    build: {
      ...baseConfig.build,
      assetsDir: '',
      minify,
      sourcemap: sourcemaps,
      rollupOptions: {
        input: {
          leao: ctx.entry,
        },
      },
    },
  };
};

const resolveDevelopmentConfig = async (ctx: BuildContext): Promise<InlineConfig> => {
  const monorepo = await loadLeaoMonorepo(ctx.cwd);
  const baseConfig = await resolveBaseConfig(ctx);

  return {
    ...baseConfig,
    mode: 'development',
    resolve: {
      ...baseConfig.resolve,
      alias: {
        ...baseConfig.resolve?.alias,
        ...getMonorepoAliases({ monorepo }),
      },
    },
    server: {
      middlewareMode: true,
      open: ctx.options.open,
      hmr: false, // 禁用 HMR，避免服务器重启时 WebSocket 断开后自动刷新页面
      watch: {
        // 忽略 .env 变更，避免首次启动时 JWT_SECRET 写入触发重启并输出误导性的 "build was canceled"
        ignored: ['**/.env', '**/.env.*'],
      },
    },
    appType: 'custom',
  };
};

const USER_CONFIGS = ['vite.config.js', 'vite.config.mjs', 'vite.config.ts'];

type UserViteConfig = (config: UserConfig) => UserConfig;

const mergeConfigWithUserConfig = async (config: InlineConfig, ctx: BuildContext) => {
  const userConfig = await getUserConfig<UserViteConfig>(USER_CONFIGS, ctx);

  if (userConfig) {
    return userConfig(config);
  }

  return config;
};

export { mergeConfigWithUserConfig, resolveProductionConfig, resolveDevelopmentConfig };
