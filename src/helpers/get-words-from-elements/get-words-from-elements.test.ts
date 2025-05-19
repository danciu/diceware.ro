import { getWordsFromElements } from './get-words-from-elements.ts';

const createMockElement = (textContent?: string) =>
  ({
    textContent: textContent || null,
  }) as Element;

describe('getWordsFromElements()', () => {
  it('should filter words based on length', () => {
    const elements = [
      createMockElement('ab'),
      createMockElement('word'),
      createMockElement('toolongword'),
    ];

    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual(['word']);
  });

  it('should filter words with diacritics', () => {
    const elements = [
      createMockElement('word'),
      createMockElement('țest'),
      createMockElement('câmp'),
      createMockElement('măr'),
    ];

    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual(['word']);
  });

  it('should filter duplicate words', () => {
    const elements = [
      createMockElement('word'),
      createMockElement('test'),
      createMockElement('word'),
    ];

    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual(['word', 'test']);
  });

  it('should filter similar words based on similarity percentage', () => {
    const elements = [
      createMockElement('test'),
      createMockElement('testing'),
      createMockElement('word'),
    ];

    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual(['test', 'word']);
  });

  it('should filter words with spaces', () => {
    const elements = [
      createMockElement('normal'),
      createMockElement('has space'),
    ];

    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual(['normal']);
  });

  it('should filter words with dots', () => {
    const elements = [
      createMockElement('normal'),
      createMockElement('has.dot'),
    ];

    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual(['normal']);
  });

  it('should clean words by removing parentheses, digits, and hyphens', () => {
    const elements = [
      createMockElement('base(extra)'),
      createMockElement('with1number'),
      createMockElement('with-hyphen'),
    ];

    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual(['base']);
  });

  it('should handle empty elements array', () => {
    const elements: Element[] = [];
    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual([]);
  });

  it('should handle elements with null textContent', () => {
    const elements = [createMockElement()];
    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual([]);
  });

  it('should handle elements with empty string textContent', () => {
    const elements = [createMockElement('')];
    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual([]);
  });

  it('should handle mixed valid and invalid words', () => {
    const elements = [
      createMockElement('valid'),
      createMockElement('valid'), // duplicate
      createMockElement('valido'), // too similar
      createMockElement('ab'), // too short
      createMockElement('țest'), // has diacritics
      createMockElement('has space'), // has space
      createMockElement('has.dot'), // has dot
    ];

    const result = getWordsFromElements(elements);
    expect(result).toStrictEqual(['valid']);
  });
});
