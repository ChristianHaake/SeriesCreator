import { describe, expect, it } from 'vitest';
import { de, type TranslationKey } from './de';
import { en } from './en';
import { fr } from './fr';
import { es } from './es';
import { nl } from './nl';
import { contentPages } from '../content';

describe('translations', () => {
  it('keeps keys, nonempty values and interpolation placeholders consistent', () => {
    const dictionaries = { en, fr, es, nl };
    const placeholders = (value: string) => (value.match(/\{\w+\}/g) ?? []).sort();
    for (const [locale, dictionary] of Object.entries(dictionaries)) {
      expect(Object.keys(dictionary).sort(), locale).toEqual(Object.keys(de).sort());
      for (const key of Object.keys(de) as TranslationKey[]) {
        expect(dictionary[key].trim(), `${locale}.${key}`).not.toBe('');
        expect(placeholders(dictionary[key]), `${locale}.${key}`).toEqual(placeholders(de[key]));
      }
    }
  });

  it('provides every content route in all five languages', () => {
    const paths = Object.keys(contentPages.de);
    for (const [locale, pages] of Object.entries(contentPages)) {
      expect(Object.keys(pages).sort(), locale).toEqual([...paths].sort());
      for (const page of Object.values(pages)) {
        expect(page.title.trim(), locale).not.toBe('');
        expect(page.content.trim(), locale).not.toBe('');
      }
    }
  });

  it('offers the feedback email on help and support pages in every language', () => {
    for (const [locale, pages] of Object.entries(contentPages)) {
      for (const path of ['/hilfe', '/unterstuetzung'] as const) {
        expect(pages[path].content, `${locale}${path}`).toContain(
          'mailto:apps@haak3.de?subject=SeriesCreator%20Feedback',
        );
      }
    }
  });
});
