import fetch from 'node-fetch';

import { DICT_SEARCH_URL } from '../../constants/constants.ts';

import { getNextSearchPattern } from '../get-next-search-pattern/get-next-search-pattern.ts';
import { getWordsFromHtml } from '../get-words-from-html/get-words-from-html.ts';

/*
  Gets all the words from the dictionary recursively
  by getting words from each page's HTML and returning
  a combined version of these words for all pages.
*/
export const getWordsFromDictionary = async (url: string) => {
  try {
    const response = await fetch(url);
    const body = await response.text();
    const pageWords = getWordsFromHtml(body);
    const nextSearchPattern = getNextSearchPattern(url);

    console.log(
      `-> ${url.replace(DICT_SEARCH_URL, '')} - ${pageWords.length} words`,
    );

    if (!nextSearchPattern) {
      return pageWords;
    }

    try {
      const nextPageWords = await getWordsFromDictionary(
        `${DICT_SEARCH_URL}${nextSearchPattern}`,
      );

      return [...pageWords, ...nextPageWords];
    } catch (recursionError) {
      console.error(`Recursion error after ${url}:`, recursionError);
      return pageWords;
    }
  } catch (error) {
    return [];
  }
};
