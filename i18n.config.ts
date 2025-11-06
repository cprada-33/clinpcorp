import en from "~/locales/en.js"
import es from "~/locales/es.js"

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "en",
  messages: {
    en,
    es
  }
}))