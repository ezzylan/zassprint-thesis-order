// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/supabase"],
  compatibilityDate: "2024-07-17",
  colorMode: { preference: "light" },
  runtimeConfig: {
    telegramBotApiToken: process.env.TELEGRAM_BOT_API_TOKEN,
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      include: ["/admin/*"],
    },
  },
  routeRules: {
    "/": { prerender: true },
    "/admin/**": { ssr: false },
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
