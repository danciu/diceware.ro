import { getSimilarityPercentage } from '../get-similarity-percentage/get-similarity-percentage.ts';

export const WORD_MIN_LEN = 3;
export const WORD_MAX_LEN = 7;
export const LONG_SIMILARITY_PERCENTAGE = 50;
export const SHORT_SIMILARITY_PERCENTAGE = 70;

/*
  Gets an array of matching words from a list of word elements
  Current conditions:
    - The word is beween `WORD_MIN_LEN` and `WORD_MAX_LEN` in length;
    - There are no diacritics in 'word';
    - The word hasn't been added already;
    - The word isn't 'similar' to the previously added word (see below);
    - There are no spaces in 'word';
    - There are no dots in 'word'.
*/
export const getWordsFromElements = (elements: Element[]) => {
  let matchingWords: string[] = [];
  let prevWord = '';

  for (var i = 0; i < elements.length; i++) {
    const element = elements[i];
    /*
      Clean the word definition by removing:
        - explanations in paranthesis;
        - digits;
        - hyphens.
    */
    let word = element.textContent
      ?.toLowerCase()
      .replace(/\(.+?\)/g, '')
      .replace(/(\d|-)/g, '')
      .trim();

    if (!word || word.length < WORD_MIN_LEN || word.length > WORD_MAX_LEN) {
      continue;
    }
    // Remove this if you'd like to produce an UTF8 version of the list.
    if (/ă|î|â|ț|ș/.test(word)) {
      continue;
    }
    if (matchingWords.indexOf(word) > -1) {
      continue;
    }
    if (prevWord) {
      const [longSimilarityPercentage, shortSimilarityPercentage] =
        getSimilarityPercentage(word, prevWord);

      /*
        The longer word is over LONG_SIMILARITY_PERCENTAGE% the same as the shorter one,
        and the shorter word is over SHORT_SIMILARITY_PERCENTAGE% the same as the longer one.
      */
      if (
        longSimilarityPercentage > LONG_SIMILARITY_PERCENTAGE &&
        shortSimilarityPercentage > SHORT_SIMILARITY_PERCENTAGE
      ) {
        continue;
      }
    }
    if (/\s/.test(word)) {
      continue;
    }
    if (/\./.test(word)) {
      continue;
    }

    matchingWords.push(word);
    prevWord = word;
  }

  return matchingWords;
};
