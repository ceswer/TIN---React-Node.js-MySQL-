import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import pl from "./locales/pl.json";
import ua from "./locales/ua.json";

const resources = {
    en: { translation: en },
    pl: { translation: pl },
    ua: { translation: ua }
}

i18n.use(initReactI18next).init(
    {
        resources,
        fallbackLng: 'en',
        lng: 'en',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['cookie'],
            cache: ['cookie']
        }
    }
);

export default i18n;