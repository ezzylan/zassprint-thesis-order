// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt-auth-utils", "@vueuse/nuxt"],
  compatibilityDate: "2024-07-17",
  css: ["~/assets/css/main.css"],
  ui: { colorMode: false },
  runtimeConfig: {
    telegramBotApiToken: process.env.TELEGRAM_BOT_API_TOKEN,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
    databaseUrl: process.env.DATABASE_URL,
  },
  routeRules: {
    "/": { prerender: true },
    "/admin/**": { ssr: false },
  },
  fonts: { providers: { bunny: false } },
  app: {
    head: {
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/logo-zassprint.svg",
        },
      ],
    },
  },
});
