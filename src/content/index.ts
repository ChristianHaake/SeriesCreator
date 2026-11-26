import support from "./unterstuetzung.md?raw";
import supportEn from "./en/support.md?raw";
import datenschutz from "./datenschutz.md?raw";
import hilfe from "./hilfe.md?raw";
import impressum from "./impressum.md?raw";
import ueber from "./ueber.md?raw";
import lehrkraefte from "./lehrkraefte.md?raw";
import verantwortungsvoll from "./verantwortungsvoll.md?raw";
import nutzungsbedingungen from "./nutzungsbedingungen.md?raw";
import privacyEn from "./en/privacy.md?raw";
import helpEn from "./en/help.md?raw";
import legalEn from "./en/legal.md?raw";
import aboutEn from "./en/about.md?raw";
import educatorsEn from "./en/educators.md?raw";
import responsibleEn from "./en/responsible-use.md?raw";
import termsEn from "./en/terms.md?raw";
import supportFr from "./fr/support.md?raw";
import helpFr from "./fr/help.md?raw";
import aboutFr from "./fr/about.md?raw";
import educatorsFr from "./fr/educators.md?raw";
import responsibleFr from "./fr/responsible-use.md?raw";
import termsFr from "./fr/terms.md?raw";
import privacyFr from "./fr/privacy.md?raw";
import legalFr from "./fr/legal.md?raw";
import supportEs from "./es/support.md?raw";
import helpEs from "./es/help.md?raw";
import aboutEs from "./es/about.md?raw";
import educatorsEs from "./es/educators.md?raw";
import responsibleEs from "./es/responsible-use.md?raw";
import termsEs from "./es/terms.md?raw";
import privacyEs from "./es/privacy.md?raw";
import legalEs from "./es/legal.md?raw";
import supportNl from "./nl/support.md?raw";
import helpNl from "./nl/help.md?raw";
import aboutNl from "./nl/about.md?raw";
import educatorsNl from "./nl/educators.md?raw";
import responsibleNl from "./nl/responsible-use.md?raw";
import termsNl from "./nl/terms.md?raw";
import privacyNl from "./nl/privacy.md?raw";
import legalNl from "./nl/legal.md?raw";

export const contentPages = {
  de: {
    "/unterstuetzung": { title: "Unterstützung", content: support },
    "/hilfe": { title: "Hilfe", content: hilfe },
    "/ueber": { title: "Über das Projekt", content: ueber },
    "/lehrkraefte": {
      title: "Hinweise für Lehrkräfte",
      content: lehrkraefte,
    },
    "/verantwortungsvoll": {
      title: "Verantwortungsvoller Einsatz",
      content: verantwortungsvoll,
    },
    "/nutzungsbedingungen": {
      title: "Nutzungsbedingungen",
      content: nutzungsbedingungen,
    },
    "/datenschutz": { title: "Datenschutz", content: datenschutz },
    "/impressum": { title: "Impressum", content: impressum },
  },
  en: {
    "/unterstuetzung": { title: "Support", content: supportEn },
    "/hilfe": { title: "Help", content: helpEn },
    "/ueber": { title: "About the project", content: aboutEn },
    "/lehrkraefte": {
      title: "Information for educators",
      content: educatorsEn,
    },
    "/verantwortungsvoll": {
      title: "Responsible use",
      content: responsibleEn,
    },
    "/nutzungsbedingungen": { title: "Terms of use", content: termsEn },
    "/datenschutz": { title: "Privacy", content: privacyEn },
    "/impressum": { title: "Legal notice", content: legalEn },
  },
  fr: {
    "/unterstuetzung": { title: "Soutien", content: supportFr },
    "/hilfe": { title: "Aide", content: helpFr },
    "/ueber": { title: "À propos du projet", content: aboutFr },
    "/lehrkraefte": { title: "Informations pour le personnel enseignant", content: educatorsFr },
    "/verantwortungsvoll": { title: "Utilisation responsable", content: responsibleFr },
    "/nutzungsbedingungen": { title: "Conditions d’utilisation", content: termsFr },
    "/datenschutz": { title: "Confidentialité", content: privacyFr },
    "/impressum": { title: "Mentions légales", content: legalFr },
  },
  es: {
    "/unterstuetzung": { title: "Apoyo", content: supportEs },
    "/hilfe": { title: "Ayuda", content: helpEs },
    "/ueber": { title: "Acerca del proyecto", content: aboutEs },
    "/lehrkraefte": { title: "Información para docentes", content: educatorsEs },
    "/verantwortungsvoll": { title: "Uso responsable", content: responsibleEs },
    "/nutzungsbedingungen": { title: "Condiciones de uso", content: termsEs },
    "/datenschutz": { title: "Privacidad", content: privacyEs },
    "/impressum": { title: "Aviso legal", content: legalEs },
  },
  nl: {
    "/unterstuetzung": { title: "Ondersteuning", content: supportNl },
    "/hilfe": { title: "Hulp", content: helpNl },
    "/ueber": { title: "Over het project", content: aboutNl },
    "/lehrkraefte": { title: "Informatie voor docenten", content: educatorsNl },
    "/verantwortungsvoll": { title: "Verantwoord gebruik", content: responsibleNl },
    "/nutzungsbedingungen": { title: "Gebruiksvoorwaarden", content: termsNl },
    "/datenschutz": { title: "Privacy", content: privacyNl },
    "/impressum": { title: "Colofon", content: legalNl },
  },
} as const;

export type ContentPath = keyof typeof contentPages.de;

export function isContentPath(pathname: string): pathname is ContentPath {
  return pathname in contentPages.de;
}
