import { theme } from "#tailwind-config";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",

  devtools: { enabled: true },

  features: {
    devLogs: false,
  },

  ssr: false,

  css: ["~/assets/css/main.css"],

  modules: [
    "@nuxt/ui",
    "@nuxtjs/tailwindcss",
    [
      "@prisma/nuxt",
      {
        studio: false,
        client: {
          autoRegister: false,
          prismaPath: "node_modules/.prisma/client",
        },
      },
    ],
  ],

  components: [
    {
      path: "~/components",
      pathPrefix: false,
      extensions: [".vue"],
    },
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET,
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
    },
  },

  colorMode: {
    preference: "system",
    fallback: "light",
  },

  vite: {
    build: {
      cssMinify: "esbuild",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === "production",
          drop_debugger: process.env.NODE_ENV === "production",
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["vue", "pinia"],
            prisma: ["@prisma/client"],
          },
        },
      },
    },

    optimizeDeps: {
      include: ["vue", "vue-router", "@google/generative-ai", "jwt-decode"],
    },

    css: {
      preprocessorMaxWorkers: true,
    },
  },

  experimental: {
    asyncEntry: true,
    componentIslands: true,
    viewTransition: true,
    renderJsonPayloads: false,
    clientFallback: true,
  },

  nitro: {
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },

    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },

    moduleSideEffects: [],

    minify: true,

    routeRules: {
      "/api/**": {
        cors: true,
        headers: {
          "Access-Control-Allow-Methods":
            "GET,HEAD,PUT,PATCH,POST,DELETE",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers": "*",
        },
      },
      "/api/news": {
        swr: 1800,
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  build: {
    transpile: ["@google/generative-ai", "cookie"],
  },

  tailwindcss: {
    configPath: "~/tailwind.config.ts",
    exposeConfig: false,
    viewer: false,
  },
});
