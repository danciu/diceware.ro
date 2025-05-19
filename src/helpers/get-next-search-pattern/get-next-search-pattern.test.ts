import {
  getNextSearchPattern,
  LAST_SEARCH_PATTERN,
} from './get-next-search-pattern.ts';

describe('getNextSearchPattern()', () => {
  it('should return null when the search pattern is the last pattern (zz*)', () => {
    const url = `https://example.com/search?q=${LAST_SEARCH_PATTERN}`;
    expect(getNextSearchPattern(url)).toBeNull();
  });

  it('should handle uppercase letters in the pattern', () => {
    const url = 'https://example.com/search?q=AB*';
    expect(getNextSearchPattern(url)).toBe('ac*');
  });

  it('should increment from one letter to another when second letter is z', () => {
    const setup = [
      { url: 'https://example.com/search?q=az*', expected: 'ba*' },
      { url: 'https://example.com/search?q=bz*', expected: 'ca*' },
      { url: 'https://example.com/search?q=cz*', expected: 'da*' },
      { url: 'https://example.com/search?q=yz*', expected: 'za*' },
    ];

    for (const { url, expected } of setup) {
      expect(getNextSearchPattern(url)).toBe(expected);
    }
  });

  it('should correctly handle edge case before the last pattern', () => {
    const url = 'https://example.com/search?q=zy*';
    expect(getNextSearchPattern(url)).toBe('zz*');
  });

  it('should handle patterns with first letter z', () => {
    const setup = [
      { url: 'https://example.com/search?q=za*', expected: 'zb*' },
      { url: 'https://example.com/search?q=zk*', expected: 'zl*' },
      { url: 'https://example.com/search?q=zz*', expected: null },
    ];

    for (const { url, expected } of setup) {
      expect(getNextSearchPattern(url)).toBe(expected);
    }
  });

  it('should handle patterns with first letter a', () => {
    const setup = [
      { url: 'https://example.com/search?q=aa*', expected: 'ab*' },
      { url: 'https://example.com/search?q=aj*', expected: 'ak*' },
      { url: 'https://example.com/search?q=az*', expected: 'ba*' },
    ];

    for (const { url, expected } of setup) {
      expect(getNextSearchPattern(url)).toBe(expected);
    }
  });

  it('should handle patterns with non-standard URL formats', () => {
    const setup = [
      {
        url: 'https://example.com/search/dictionary/ab*?param=value',
        expected: 'ac*',
      },
      {
        url: 'https://example.com/api?pattern=cd*&other=param',
        expected: 'ce*',
      },
      { url: 'https://example.com/ab*/cd*/ef*', expected: 'ac*' },
    ];

    for (const { url, expected } of setup) {
      expect(getNextSearchPattern(url)).toBe(expected);
    }
  });

  it('should handle the case where the pattern is followed by other characters', () => {
    const url = 'https://example.com/search?q=xy*z';
    expect(getNextSearchPattern(url)).toBe('xz*');
  });

  it('should handle malformed or incomplete patterns', () => {
    const malformedUrls = [
      'https://example.com/search?q=a*',
      'https://example.com/search?q=*',
      'https://example.com/search?q=',
    ];

    for (const url of malformedUrls) {
      expect(getNextSearchPattern(url)).toBeNull();
    }
  });
});
