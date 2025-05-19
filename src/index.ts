import { fileURLToPath } from 'url';

import { DICT_SEARCH_URL } from './constants/constants.ts';
import { getWordsFromDictionary } from './helpers/get-words-from-dictionary/get-words-from-dictionary.ts';
import { saveWordsToFile } from './helpers/save-words-to-file/save-words-to-file.ts';

export const DICT_SEARCH_START_QUERY = 'aa*';

const rootUrl = import.meta.resolve('..', import.meta.url);
const rootPath = fileURLToPath(rootUrl);
const allPageWords = await getWordsFromDictionary(
  `${DICT_SEARCH_URL}${DICT_SEARCH_START_QUERY}`,
);
saveWordsToFile(allPageWords, rootPath);
