import fetch from 'node-fetch';

import { DICT_SEARCH_URL } from '../../constants/constants.ts';
import { getNextSearchPattern } from '../get-next-search-pattern/get-next-search-pattern.ts';
import { getWordsFromHtml } from '../get-words-from-html/get-words-from-html.ts';

import { getWordsFromDictionary } from './get-words-from-dictionary.ts';

jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(async () =>
    Promise.resolve({
      text: async () => Promise.resolve('mock html content'),
    }),
  ),
}));

jest.mock('../get-words-from-html/get-words-from-html.ts', () => ({
  getWordsFromHtml: jest.fn(() => []),
}));

jest.mock('../get-next-search-pattern/get-next-search-pattern.ts', () => ({
  getNextSearchPattern: jest.fn(() => null),
}));

describe('requestPage()', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('should return an empty array', async () => {
    const result = await getWordsFromDictionary('https://example.com/test*');

    expect(fetch).toHaveBeenCalledWith('https://example.com/test*');
    expect(getWordsFromHtml).toHaveBeenCalledWith('mock html content');
    expect(getNextSearchPattern).toHaveBeenCalledWith(
      'https://example.com/test*',
    );
    expect(result).toStrictEqual([]);
  });

  it('should return all words based on recursive call', async () => {
    (getNextSearchPattern as jest.Mock)
      .mockReturnValueOnce('ab*')
      .mockReturnValueOnce(null);
    (getWordsFromHtml as jest.Mock)
      .mockReturnValueOnce(['word1', 'word2'])
      .mockReturnValueOnce(['word3', 'word4']);

    const result = await getWordsFromDictionary(`${DICT_SEARCH_URL}aa*`);

    expect(fetch).toHaveBeenNthCalledWith(1, `${DICT_SEARCH_URL}aa*`);
    expect(fetch).toHaveBeenNthCalledWith(2, `${DICT_SEARCH_URL}ab*`);
    expect(console.log).toHaveBeenNthCalledWith(1, '-> aa* - 2 words');
    expect(console.log).toHaveBeenNthCalledWith(2, '-> ab* - 2 words');
    expect(result).toStrictEqual(['word1', 'word2', 'word3', 'word4']);
  });

  it('should return empty array on main catch block', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const result = await getWordsFromDictionary('https://example.com/test*');

    expect(result).toStrictEqual([]);
  });

  it('should return saved words for recursion catch block', async () => {
    (getNextSearchPattern as jest.Mock).mockReturnValueOnce('error*');
    (getWordsFromHtml as jest.Mock).mockReturnValueOnce(['word1', 'word2']);
    (fetch as jest.Mock)
      .mockResolvedValueOnce({
        text: async () => Promise.resolve('mock html content'),
      })
      .mockRejectedValueOnce(new Error('Network error'));

    const result = await getWordsFromDictionary('https://example.com/test*');

    expect(result).toStrictEqual(['word1', 'word2']);
  });
});
