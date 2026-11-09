import { describe, expect, it } from 'vitest';
import { de, type TranslationKey } from './de';
import { en } from './en';

describe('translations', () => {
  it('keeps keys, nonempty values and interpolation placeholders consistent', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(de).sort());
    const placeholders = (value: string) => (value.match(/\{\w+\}/g) ?? []).sort();
    for (const key of Object.keys(de) as TranslationKey[]) {
      expect(de[key].trim(), `de.${key}`).not.toBe('');
      expect(en[key].trim(), `en.${key}`).not.toBe('');
      expect(placeholders(en[key]), key).toEqual(placeholders(de[key]));
    }
  });
});
