// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase", "nuxt-auth-utils"],
  compatibilityDate: "2024-07-17",
  colorMode: { preference: "light" },
  runtimeConfig: {
    telegramBotApiToken: process.env.TELEGRAM_BOT_API_TOKEN,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword: process.env.ADMIN_PASSWORD,
  },
  routeRules: {
    "/": { prerender: true },
    "/admin/**": { ssr: false },
  },
  supabase: {
    redirect: false,
  },
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
