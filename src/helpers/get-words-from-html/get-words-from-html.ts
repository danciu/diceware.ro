import { JSDOM } from 'jsdom';

import { getWordsFromElements } from '../get-words-from-elements/get-words-from-elements.ts';

export const DOM_LIST_SELECTOR = 'ul.list-inline';

/*
  Get all words from passed HTML syntax
*/
export const getWordsFromHtml = (html: string): string[] => {
  const DOM = new JSDOM(html);
  const elWordsList = DOM.window.document.querySelector(DOM_LIST_SELECTOR);

  if (!elWordsList) {
    return [];
  }

  const wordListItems = Array.from(elWordsList.children);

  return getWordsFromElements(wordListItems);
};
