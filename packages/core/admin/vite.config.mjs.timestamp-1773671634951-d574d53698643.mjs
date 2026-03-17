// vite.config.mjs
import { defineConfig } from "file:///Users/leo/Desktop/demo1/strapi/node_modules/vite/dist/node/index.js";
import react from "file:///Users/leo/Desktop/demo1/strapi/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { builtinModules } from "node:module";
import dts from "file:///Users/leo/Desktop/demo1/strapi/node_modules/vite-plugin-dts/dist/index.mjs";

// package.json
var package_default = {
  name: "@leao1/admin",
  version: "1.0.0",
  description: "Leao Admin",
  repository: {
    type: "git",
    url: "git://github.com/leao/leao.git"
  },
  license: "UNLICENSED",
  author: {
    name: "Leao Solutions SAS",
    email: "hi@leao.io",
    url: "https://leao.io"
  },
  maintainers: [
    {
      name: "Leao Solutions SAS",
      email: "hi@leao.io",
      url: "https://leao.io"
    }
  ],
  exports: {
    "./leao-admin": {
      types: "./dist/admin/src/index.d.ts",
      source: "./admin/src/index.ts",
      import: "./dist/admin/index.mjs",
      require: "./dist/admin/index.js",
      default: "./dist/admin/index.js"
    },
    "./leao-admin/ee": {
      types: "./dist/admin/src/ee.d.ts",
      source: "./admin/src/ee.ts",
      import: "./dist/admin/ee.mjs",
      require: "./dist/admin/ee.js",
      default: "./dist/admin/ee.js"
    },
    "./_internal": {
      types: "./dist/_internal/index.d.ts",
      source: "./_internal/index.ts",
      import: "./dist/_internal.mjs",
      require: "./dist/_internal.js",
      default: "./dist/_internal.js"
    },
    "./leao-server": {
      types: "./dist/server/src/index.d.ts",
      source: "./server/src/index.js",
      import: "./dist/server/index.mjs",
      require: "./dist/server/index.js",
      default: "./dist/server/index.js"
    },
    "./package.json": "./package.json"
  },
  files: [
    "dist/",
    "leao-server.js"
  ],
  scripts: {
    build: "pack-up build && vite build",
    clean: "run -T rimraf ./dist",
    lint: "run -T eslint .",
    watch: "pack-up watch"
  },
  dependencies: {
    "@casl/ability": "6.5.0",
    "@internationalized/date": "3.5.4",
    "@leao1/design-system": "^1.0.0",
    "@leao1/permissions": "^1.0.0",
    "@leao1/types": "^1.0.0",
    "@leao1/typescript-utils": "^1.0.0",
    "@leao1/utils": "^1.0.0",
    "@radix-ui/react-context": "1.0.1",
    "@radix-ui/react-toolbar": "1.0.4",
    "@reduxjs/toolkit": "1.9.7",
    axios: "1.7.4",
    bcryptjs: "2.4.3",
    boxen: "5.1.2",
    chalk: "^4.1.2",
    codemirror5: "npm:codemirror@^5.65.11",
    "cross-env": "^7.0.3",
    "date-fns": "2.30.0",
    execa: "5.1.1",
    "fast-deep-equal": "3.1.3",
    formik: "2.4.5",
    "fractional-indexing": "3.2.0",
    "fs-extra": "11.2.0",
    "highlight.js": "^10.4.1",
    immer: "9.0.21",
    inquirer: "8.2.5",
    invariant: "^2.2.4",
    "is-localhost-ip": "2.0.0",
    jsonwebtoken: "9.0.0",
    koa: "2.15.2",
    "koa-compose": "4.1.0",
    "koa-passport": "6.0.0",
    "koa-static": "5.0.0",
    "koa2-ratelimit": "^1.1.3",
    lodash: "4.17.21",
    "node-schedule": "2.1.1",
    ora: "5.4.1",
    "p-map": "4.0.0",
    "passport-local": "1.0.0",
    pluralize: "8.0.0",
    punycode: "2.3.1",
    qs: "6.11.1",
    "react-dnd": "16.0.1",
    "react-dnd-html5-backend": "16.0.1",
    "react-intl": "6.6.2",
    "react-is": "^18.2.0",
    "react-query": "3.39.3",
    "react-redux": "8.1.3",
    "react-select": "5.8.0",
    "react-window": "1.8.10",
    rimraf: "5.0.5",
    "sanitize-html": "2.13.0",
    scheduler: "0.23.0",
    semver: "7.5.4",
    sift: "16.0.1",
    typescript: "5.3.2",
    "use-context-selector": "1.4.1",
    yup: "0.32.9",
    zod: "^3.22.4"
  },
  devDependencies: {
    "@leao1/data-transfer": "^1.0.0",
    "@leao1/pack-up": "^1.0.0",
    "@types/codemirror5": "npm:@types/codemirror@^5.60.15",
    "@types/fs-extra": "11.0.4",
    "@types/invariant": "2.2.36",
    "@types/jsonwebtoken": "9.0.3",
    "@types/koa-passport": "6.0.1",
    "@types/lodash": "^4.14.191",
    "@types/markdown-it": "13.0.7",
    "@types/markdown-it-container": "2.0.9",
    "@types/markdown-it-emoji": "2.0.4",
    "@types/markdown-it-footnote": "3.0.3",
    "@types/passport-local": "1.0.36",
    "@types/pluralize": "0.0.32",
    "@types/punycode": "2.1.4",
    "@types/react-window": "1.8.8",
    "@types/sanitize-html": "2.13.0",
    "@vitejs/plugin-react-swc": "3.6.0",
    "koa-body": "6.0.1",
    react: "18.3.1",
    "react-dom": "18.3.1",
    "react-router-dom": "6.22.3",
    "styled-components": "6.1.8",
    vite: "5.2.14",
    "vite-plugin-dts": "3.7.3"
  },
  peerDependencies: {
    "@leao1/data-transfer": "^5.0.0 ||\xA0 ^5.0.0-beta || ^5.0.0-alpha || ^5.0.0-rc",
    react: "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0",
    "react-router-dom": "^6.0.0",
    "styled-components": "^6.0.0"
  },
  engines: {
    node: ">=18.0.0 <=22.x.x",
    npm: ">=6.0.0"
  },
  nx: {
    targets: {
      build: {
        outputs: [
          "{projectRoot}/build"
        ]
      }
    }
  }
};

// vite.config.mjs
var vite_config_default = defineConfig({
  build: {
    emptyOutDir: false,
    target: "esnext",
    outDir: "dist/admin",
    sourcemap: true,
    minify: false,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: {
        index: "./admin/src/index.ts",
        ee: "./admin/src/ee.ts"
      }
    },
    rollupOptions: {
      external(id) {
        const external = [
          ...package_default.dependencies ? Object.keys(package_default.dependencies) : [],
          ...package_default.peerDependencies ? Object.keys(package_default.peerDependencies) : []
        ];
        const idParts = id.split("/");
        const name = idParts[0].startsWith("@") ? `${idParts[0]}/${idParts[1]}` : idParts[0];
        const builtinModulesWithNodePrefix = [
          ...builtinModules,
          ...builtinModules.map((modName) => `node:${modName}`)
        ];
        if (name && external.includes(name) || name && builtinModulesWithNodePrefix.includes(name)) {
          return true;
        }
        return false;
      },
      output: {
        interop: "auto"
      }
    }
  },
  plugins: [
    dts({
      outDir: "./dist",
      tsconfigPath: "./admin/tsconfig.build.json"
    }),
    react()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIiwgInBhY2thZ2UuanNvbiJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9sZW8vRGVza3RvcC9kZW1vMS9zdHJhcGkvcGFja2FnZXMvY29yZS9hZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2xlby9EZXNrdG9wL2RlbW8xL3N0cmFwaS9wYWNrYWdlcy9jb3JlL2FkbWluL3ZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvbGVvL0Rlc2t0b3AvZGVtbzEvc3RyYXBpL3BhY2thZ2VzL2NvcmUvYWRtaW4vdml0ZS5jb25maWcubWpzXCI7LyogZXNsaW50LWRpc2FibGUgaW1wb3J0L25vLWV4dHJhbmVvdXMtZGVwZW5kZW5jaWVzICovXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnO1xuaW1wb3J0IHsgYnVpbHRpbk1vZHVsZXMgfSBmcm9tICdub2RlOm1vZHVsZSc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5cbmltcG9ydCBwa2cgZnJvbSAnLi9wYWNrYWdlLmpzb24nO1xuXG4vKipcbiAqIFRPRE86IHdlIHNob3VsZCBoYXZlIGBwYWNrLXVwYCBoYW5kbGUgdGhpcyBmb3IgdXMsIGJ1dCB0aW1lIGNvbnN0YWludHNcbiAqIGhhdmUgbWVhbnQgaSd2ZSBmYWxsZW4gYmFjayB0byB2aXRlIG9yIGEgZmFzdCBzb2x1dGlvbi5cbiAqXG4gKiBDb250ZW50IHBhbmVsIGZpeFxuICovXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBidWlsZDoge1xuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgIG91dERpcjogJ2Rpc3QvYWRtaW4nLFxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBtaW5pZnk6IGZhbHNlLFxuICAgIGxpYjoge1xuICAgICAgLy8gQ291bGQgYWxzbyBiZSBhIGRpY3Rpb25hcnkgb3IgYXJyYXkgb2YgbXVsdGlwbGUgZW50cnkgcG9pbnRzXG4gICAgICBlbnRyeToge1xuICAgICAgICBpbmRleDogJy4vYWRtaW4vc3JjL2luZGV4LnRzJyxcbiAgICAgICAgZWU6ICcuL2FkbWluL3NyYy9lZS50cycsXG4gICAgICB9LFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWwoaWQpIHtcbiAgICAgICAgY29uc3QgZXh0ZXJuYWwgPSBbXG4gICAgICAgICAgLi4uKHBrZy5kZXBlbmRlbmNpZXMgPyBPYmplY3Qua2V5cyhwa2cuZGVwZW5kZW5jaWVzKSA6IFtdKSxcbiAgICAgICAgICAuLi4ocGtnLnBlZXJEZXBlbmRlbmNpZXMgPyBPYmplY3Qua2V5cyhwa2cucGVlckRlcGVuZGVuY2llcykgOiBbXSksXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgaWRQYXJ0cyA9IGlkLnNwbGl0KCcvJyk7XG5cbiAgICAgICAgY29uc3QgbmFtZSA9IGlkUGFydHNbMF0uc3RhcnRzV2l0aCgnQCcpID8gYCR7aWRQYXJ0c1swXX0vJHtpZFBhcnRzWzFdfWAgOiBpZFBhcnRzWzBdO1xuXG4gICAgICAgIGNvbnN0IGJ1aWx0aW5Nb2R1bGVzV2l0aE5vZGVQcmVmaXggPSBbXG4gICAgICAgICAgLi4uYnVpbHRpbk1vZHVsZXMsXG4gICAgICAgICAgLi4uYnVpbHRpbk1vZHVsZXMubWFwKChtb2ROYW1lKSA9PiBgbm9kZToke21vZE5hbWV9YCksXG4gICAgICAgIF07XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIChuYW1lICYmIGV4dGVybmFsLmluY2x1ZGVzKG5hbWUpKSB8fFxuICAgICAgICAgIChuYW1lICYmIGJ1aWx0aW5Nb2R1bGVzV2l0aE5vZGVQcmVmaXguaW5jbHVkZXMobmFtZSkpXG4gICAgICAgICkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBpbnRlcm9wOiAnYXV0bycsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICBkdHMoe1xuICAgICAgb3V0RGlyOiAnLi9kaXN0JyxcbiAgICAgIHRzY29uZmlnUGF0aDogJy4vYWRtaW4vdHNjb25maWcuYnVpbGQuanNvbicsXG4gICAgfSksXG4gICAgcmVhY3QoKSxcbiAgXSxcbn0pO1xuIiwgIntcbiAgXCJuYW1lXCI6IFwiQGxlYW8xL2FkbWluXCIsXG4gIFwidmVyc2lvblwiOiBcIjEuMC4wXCIsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJMZWFvIEFkbWluXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQ6Ly9naXRodWIuY29tL2xlYW8vbGVhby5naXRcIlxuICB9LFxuICBcImxpY2Vuc2VcIjogXCJVTkxJQ0VOU0VEXCIsXG4gIFwiYXV0aG9yXCI6IHtcbiAgICBcIm5hbWVcIjogXCJMZWFvIFNvbHV0aW9ucyBTQVNcIixcbiAgICBcImVtYWlsXCI6IFwiaGlAbGVhby5pb1wiLFxuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9sZWFvLmlvXCJcbiAgfSxcbiAgXCJtYWludGFpbmVyc1wiOiBbXG4gICAge1xuICAgICAgXCJuYW1lXCI6IFwiTGVhbyBTb2x1dGlvbnMgU0FTXCIsXG4gICAgICBcImVtYWlsXCI6IFwiaGlAbGVhby5pb1wiLFxuICAgICAgXCJ1cmxcIjogXCJodHRwczovL2xlYW8uaW9cIlxuICAgIH1cbiAgXSxcbiAgXCJleHBvcnRzXCI6IHtcbiAgICBcIi4vbGVhby1hZG1pblwiOiB7XG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L2FkbWluL3NyYy9pbmRleC5kLnRzXCIsXG4gICAgICBcInNvdXJjZVwiOiBcIi4vYWRtaW4vc3JjL2luZGV4LnRzXCIsXG4gICAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9hZG1pbi9pbmRleC5tanNcIixcbiAgICAgIFwicmVxdWlyZVwiOiBcIi4vZGlzdC9hZG1pbi9pbmRleC5qc1wiLFxuICAgICAgXCJkZWZhdWx0XCI6IFwiLi9kaXN0L2FkbWluL2luZGV4LmpzXCJcbiAgICB9LFxuICAgIFwiLi9sZWFvLWFkbWluL2VlXCI6IHtcbiAgICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvYWRtaW4vc3JjL2VlLmQudHNcIixcbiAgICAgIFwic291cmNlXCI6IFwiLi9hZG1pbi9zcmMvZWUudHNcIixcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L2FkbWluL2VlLm1qc1wiLFxuICAgICAgXCJyZXF1aXJlXCI6IFwiLi9kaXN0L2FkbWluL2VlLmpzXCIsXG4gICAgICBcImRlZmF1bHRcIjogXCIuL2Rpc3QvYWRtaW4vZWUuanNcIlxuICAgIH0sXG4gICAgXCIuL19pbnRlcm5hbFwiOiB7XG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L19pbnRlcm5hbC9pbmRleC5kLnRzXCIsXG4gICAgICBcInNvdXJjZVwiOiBcIi4vX2ludGVybmFsL2luZGV4LnRzXCIsXG4gICAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9faW50ZXJuYWwubWpzXCIsXG4gICAgICBcInJlcXVpcmVcIjogXCIuL2Rpc3QvX2ludGVybmFsLmpzXCIsXG4gICAgICBcImRlZmF1bHRcIjogXCIuL2Rpc3QvX2ludGVybmFsLmpzXCJcbiAgICB9LFxuICAgIFwiLi9sZWFvLXNlcnZlclwiOiB7XG4gICAgICBcInR5cGVzXCI6IFwiLi9kaXN0L3NlcnZlci9zcmMvaW5kZXguZC50c1wiLFxuICAgICAgXCJzb3VyY2VcIjogXCIuL3NlcnZlci9zcmMvaW5kZXguanNcIixcbiAgICAgIFwiaW1wb3J0XCI6IFwiLi9kaXN0L3NlcnZlci9pbmRleC5tanNcIixcbiAgICAgIFwicmVxdWlyZVwiOiBcIi4vZGlzdC9zZXJ2ZXIvaW5kZXguanNcIixcbiAgICAgIFwiZGVmYXVsdFwiOiBcIi4vZGlzdC9zZXJ2ZXIvaW5kZXguanNcIlxuICAgIH0sXG4gICAgXCIuL3BhY2thZ2UuanNvblwiOiBcIi4vcGFja2FnZS5qc29uXCJcbiAgfSxcbiAgXCJmaWxlc1wiOiBbXG4gICAgXCJkaXN0L1wiLFxuICAgIFwibGVhby1zZXJ2ZXIuanNcIlxuICBdLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJwYWNrLXVwIGJ1aWxkICYmIHZpdGUgYnVpbGRcIixcbiAgICBcImNsZWFuXCI6IFwicnVuIC1UIHJpbXJhZiAuL2Rpc3RcIixcbiAgICBcImxpbnRcIjogXCJydW4gLVQgZXNsaW50IC5cIixcbiAgICBcIndhdGNoXCI6IFwicGFjay11cCB3YXRjaFwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBjYXNsL2FiaWxpdHlcIjogXCI2LjUuMFwiLFxuICAgIFwiQGludGVybmF0aW9uYWxpemVkL2RhdGVcIjogXCIzLjUuNFwiLFxuICAgIFwiQGxlYW8xL2Rlc2lnbi1zeXN0ZW1cIjogXCJeMS4wLjBcIixcbiAgICBcIkBsZWFvMS9wZXJtaXNzaW9uc1wiOiBcIl4xLjAuMFwiLFxuICAgIFwiQGxlYW8xL3R5cGVzXCI6IFwiXjEuMC4wXCIsXG4gICAgXCJAbGVhbzEvdHlwZXNjcmlwdC11dGlsc1wiOiBcIl4xLjAuMFwiLFxuICAgIFwiQGxlYW8xL3V0aWxzXCI6IFwiXjEuMC4wXCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3QtY29udGV4dFwiOiBcIjEuMC4xXCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3QtdG9vbGJhclwiOiBcIjEuMC40XCIsXG4gICAgXCJAcmVkdXhqcy90b29sa2l0XCI6IFwiMS45LjdcIixcbiAgICBcImF4aW9zXCI6IFwiMS43LjRcIixcbiAgICBcImJjcnlwdGpzXCI6IFwiMi40LjNcIixcbiAgICBcImJveGVuXCI6IFwiNS4xLjJcIixcbiAgICBcImNoYWxrXCI6IFwiXjQuMS4yXCIsXG4gICAgXCJjb2RlbWlycm9yNVwiOiBcIm5wbTpjb2RlbWlycm9yQF41LjY1LjExXCIsXG4gICAgXCJjcm9zcy1lbnZcIjogXCJeNy4wLjNcIixcbiAgICBcImRhdGUtZm5zXCI6IFwiMi4zMC4wXCIsXG4gICAgXCJleGVjYVwiOiBcIjUuMS4xXCIsXG4gICAgXCJmYXN0LWRlZXAtZXF1YWxcIjogXCIzLjEuM1wiLFxuICAgIFwiZm9ybWlrXCI6IFwiMi40LjVcIixcbiAgICBcImZyYWN0aW9uYWwtaW5kZXhpbmdcIjogXCIzLjIuMFwiLFxuICAgIFwiZnMtZXh0cmFcIjogXCIxMS4yLjBcIixcbiAgICBcImhpZ2hsaWdodC5qc1wiOiBcIl4xMC40LjFcIixcbiAgICBcImltbWVyXCI6IFwiOS4wLjIxXCIsXG4gICAgXCJpbnF1aXJlclwiOiBcIjguMi41XCIsXG4gICAgXCJpbnZhcmlhbnRcIjogXCJeMi4yLjRcIixcbiAgICBcImlzLWxvY2FsaG9zdC1pcFwiOiBcIjIuMC4wXCIsXG4gICAgXCJqc29ud2VidG9rZW5cIjogXCI5LjAuMFwiLFxuICAgIFwia29hXCI6IFwiMi4xNS4yXCIsXG4gICAgXCJrb2EtY29tcG9zZVwiOiBcIjQuMS4wXCIsXG4gICAgXCJrb2EtcGFzc3BvcnRcIjogXCI2LjAuMFwiLFxuICAgIFwia29hLXN0YXRpY1wiOiBcIjUuMC4wXCIsXG4gICAgXCJrb2EyLXJhdGVsaW1pdFwiOiBcIl4xLjEuM1wiLFxuICAgIFwibG9kYXNoXCI6IFwiNC4xNy4yMVwiLFxuICAgIFwibm9kZS1zY2hlZHVsZVwiOiBcIjIuMS4xXCIsXG4gICAgXCJvcmFcIjogXCI1LjQuMVwiLFxuICAgIFwicC1tYXBcIjogXCI0LjAuMFwiLFxuICAgIFwicGFzc3BvcnQtbG9jYWxcIjogXCIxLjAuMFwiLFxuICAgIFwicGx1cmFsaXplXCI6IFwiOC4wLjBcIixcbiAgICBcInB1bnljb2RlXCI6IFwiMi4zLjFcIixcbiAgICBcInFzXCI6IFwiNi4xMS4xXCIsXG4gICAgXCJyZWFjdC1kbmRcIjogXCIxNi4wLjFcIixcbiAgICBcInJlYWN0LWRuZC1odG1sNS1iYWNrZW5kXCI6IFwiMTYuMC4xXCIsXG4gICAgXCJyZWFjdC1pbnRsXCI6IFwiNi42LjJcIixcbiAgICBcInJlYWN0LWlzXCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtcXVlcnlcIjogXCIzLjM5LjNcIixcbiAgICBcInJlYWN0LXJlZHV4XCI6IFwiOC4xLjNcIixcbiAgICBcInJlYWN0LXNlbGVjdFwiOiBcIjUuOC4wXCIsXG4gICAgXCJyZWFjdC13aW5kb3dcIjogXCIxLjguMTBcIixcbiAgICBcInJpbXJhZlwiOiBcIjUuMC41XCIsXG4gICAgXCJzYW5pdGl6ZS1odG1sXCI6IFwiMi4xMy4wXCIsXG4gICAgXCJzY2hlZHVsZXJcIjogXCIwLjIzLjBcIixcbiAgICBcInNlbXZlclwiOiBcIjcuNS40XCIsXG4gICAgXCJzaWZ0XCI6IFwiMTYuMC4xXCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiNS4zLjJcIixcbiAgICBcInVzZS1jb250ZXh0LXNlbGVjdG9yXCI6IFwiMS40LjFcIixcbiAgICBcInl1cFwiOiBcIjAuMzIuOVwiLFxuICAgIFwiem9kXCI6IFwiXjMuMjIuNFwiXG4gIH0sXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBsZWFvMS9kYXRhLXRyYW5zZmVyXCI6IFwiXjEuMC4wXCIsXG4gICAgXCJAbGVhbzEvcGFjay11cFwiOiBcIl4xLjAuMFwiLFxuICAgIFwiQHR5cGVzL2NvZGVtaXJyb3I1XCI6IFwibnBtOkB0eXBlcy9jb2RlbWlycm9yQF41LjYwLjE1XCIsXG4gICAgXCJAdHlwZXMvZnMtZXh0cmFcIjogXCIxMS4wLjRcIixcbiAgICBcIkB0eXBlcy9pbnZhcmlhbnRcIjogXCIyLjIuMzZcIixcbiAgICBcIkB0eXBlcy9qc29ud2VidG9rZW5cIjogXCI5LjAuM1wiLFxuICAgIFwiQHR5cGVzL2tvYS1wYXNzcG9ydFwiOiBcIjYuMC4xXCIsXG4gICAgXCJAdHlwZXMvbG9kYXNoXCI6IFwiXjQuMTQuMTkxXCIsXG4gICAgXCJAdHlwZXMvbWFya2Rvd24taXRcIjogXCIxMy4wLjdcIixcbiAgICBcIkB0eXBlcy9tYXJrZG93bi1pdC1jb250YWluZXJcIjogXCIyLjAuOVwiLFxuICAgIFwiQHR5cGVzL21hcmtkb3duLWl0LWVtb2ppXCI6IFwiMi4wLjRcIixcbiAgICBcIkB0eXBlcy9tYXJrZG93bi1pdC1mb290bm90ZVwiOiBcIjMuMC4zXCIsXG4gICAgXCJAdHlwZXMvcGFzc3BvcnQtbG9jYWxcIjogXCIxLjAuMzZcIixcbiAgICBcIkB0eXBlcy9wbHVyYWxpemVcIjogXCIwLjAuMzJcIixcbiAgICBcIkB0eXBlcy9wdW55Y29kZVwiOiBcIjIuMS40XCIsXG4gICAgXCJAdHlwZXMvcmVhY3Qtd2luZG93XCI6IFwiMS44LjhcIixcbiAgICBcIkB0eXBlcy9zYW5pdGl6ZS1odG1sXCI6IFwiMi4xMy4wXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjogXCIzLjYuMFwiLFxuICAgIFwia29hLWJvZHlcIjogXCI2LjAuMVwiLFxuICAgIFwicmVhY3RcIjogXCIxOC4zLjFcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIjE4LjMuMVwiLFxuICAgIFwicmVhY3Qtcm91dGVyLWRvbVwiOiBcIjYuMjIuM1wiLFxuICAgIFwic3R5bGVkLWNvbXBvbmVudHNcIjogXCI2LjEuOFwiLFxuICAgIFwidml0ZVwiOiBcIjUuMi4xNFwiLFxuICAgIFwidml0ZS1wbHVnaW4tZHRzXCI6IFwiMy43LjNcIlxuICB9LFxuICBcInBlZXJEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGxlYW8xL2RhdGEtdHJhbnNmZXJcIjogXCJeNS4wLjAgfHxcdTAwQTAgXjUuMC4wLWJldGEgfHwgXjUuMC4wLWFscGhhIHx8IF41LjAuMC1yY1wiLFxuICAgIFwicmVhY3RcIjogXCJeMTcuMC4wIHx8IF4xOC4wLjBcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xNy4wLjAgfHwgXjE4LjAuMFwiLFxuICAgIFwicmVhY3Qtcm91dGVyLWRvbVwiOiBcIl42LjAuMFwiLFxuICAgIFwic3R5bGVkLWNvbXBvbmVudHNcIjogXCJeNi4wLjBcIlxuICB9LFxuICBcImVuZ2luZXNcIjoge1xuICAgIFwibm9kZVwiOiBcIj49MTguMC4wIDw9MjIueC54XCIsXG4gICAgXCJucG1cIjogXCI+PTYuMC4wXCJcbiAgfSxcbiAgXCJueFwiOiB7XG4gICAgXCJ0YXJnZXRzXCI6IHtcbiAgICAgIFwiYnVpbGRcIjoge1xuICAgICAgICBcIm91dHB1dHNcIjogW1xuICAgICAgICAgIFwie3Byb2plY3RSb290fS9idWlsZFwiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFDbEIsU0FBUyxzQkFBc0I7QUFDL0IsT0FBTyxTQUFTOzs7QUNKaEI7QUFBQSxFQUNFLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLGFBQWU7QUFBQSxFQUNmLFlBQWM7QUFBQSxJQUNaLE1BQVE7QUFBQSxJQUNSLEtBQU87QUFBQSxFQUNUO0FBQUEsRUFDQSxTQUFXO0FBQUEsRUFDWCxRQUFVO0FBQUEsSUFDUixNQUFRO0FBQUEsSUFDUixPQUFTO0FBQUEsSUFDVCxLQUFPO0FBQUEsRUFDVDtBQUFBLEVBQ0EsYUFBZTtBQUFBLElBQ2I7QUFBQSxNQUNFLE1BQVE7QUFBQSxNQUNSLE9BQVM7QUFBQSxNQUNULEtBQU87QUFBQSxJQUNUO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBVztBQUFBLElBQ1QsZ0JBQWdCO0FBQUEsTUFDZCxPQUFTO0FBQUEsTUFDVCxRQUFVO0FBQUEsTUFDVixRQUFVO0FBQUEsTUFDVixTQUFXO0FBQUEsTUFDWCxTQUFXO0FBQUEsSUFDYjtBQUFBLElBQ0EsbUJBQW1C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
