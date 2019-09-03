const request = require('request-promise-native');
const jsdom = require('jsdom');
const fs = require('fs');

const { JSDOM } = jsdom;

let arrWords = [];

// App constants
const DOM_LIST_CLASSNAME = 'entryList';
const WORD_MIN_LEN = 3;
const WORD_MAX_LEN = 7;
const LONG_SIMILARITY_PERCENTAGE = 50;
const SHORT_SIMILARITY_PERCENTAGE = 70;
const DICT_SEARCH_URL = 'https://dexonline.ro/definitie-dex09/';
const DICT_SEARCH_START_QUERY = 'aa*';
const SAVE_FILE_NAME = 'words.txt';

/*
 * Starts parsing a certain dictionary HTML page of
 * dexonline.ro DEX '09 search.
 * The element constant can be changed for other dictionary pages.
 */
function parseDictHtml(html) {
  const DOM = new JSDOM(html);
  const listWordElements = DOM.window.document.getElementsByClassName(DOM_LIST_CLASSNAME)[0];

  return new Promise(async (resolve) => {
    if (!listWordElements) {
      resolve();
    }
  
    await loopThroughWordElements(listWordElements);
    resolve();
  });
};

/* 
 * Get the similarity percentage between Word A and Word B:
 * Word A % similar to Word B
 * Word B % similar to Word A
 */
function getSimilarityPercentage(strWordA, strWordB) {
  const numMaxLen = Math.max(strWordA.length, strWordB.length);
  const numMinLen = Math.min(strWordA.length, strWordB.length);

  let numExactCharsLen = 0;

  for (let i = 0; i < numMaxLen; i++) {
    if (strWordA[i] !== strWordB[i]) {
      break;
    }

    numExactCharsLen++;
  }

  return [
    Math.round((numExactCharsLen / numMaxLen) * 100),
    Math.round((numExactCharsLen / numMinLen) * 100)
  ];
}

/*
 * Gets an array of matching words from a list of word elements
 * Current conditions:
 *   - The word hasn't been added already;
 *   - The word is beween `WORD_MIN_LEN` and `WORD_MAX_LEN` in length;
 *   - The word isn't 'similar' to the previously added word (see below);
 *   - There are no spaces in the 'word';
 *   - There are no dots in the 'word';
 *   - There are no diacritics in the word.
 */
function loopThroughWordElements(list) {
  let arrMatchingWords = [];
  let strPrevWord = null;

  return new Promise((resolve) => {
    for (var i = 0; i < list.children.length; i++) {
      const elemChild = list.children[i];
      // Clean the word definition of digits and explanations in paranthesis
      let strWord = elemChild.textContent.replace(/\d/, '').replace(/\(.+?\)/, '').trim();
    
      if (arrMatchingWords.indexOf(strWord) > -1) {
        continue;
      }
      if (strWord.length < WORD_MIN_LEN || strWord.length > WORD_MAX_LEN) {
        continue;
      }
      if (strPrevWord) {
        const arrSimilarityPercentage = getSimilarityPercentage(strWord, strPrevWord);
    
        /*
          The longer word is over 50% the same as the shorter one,
          and the shorter word is over 70% the same as the longer one.
        */
        if (
          arrSimilarityPercentage[0] > LONG_SIMILARITY_PERCENTAGE &&
          arrSimilarityPercentage[1] > SHORT_SIMILARITY_PERCENTAGE
        ) {
          continue;
        }
      }
      if (/\s/.test(strWord)) {
        continue;
      }
      if (/\./.test(strWord)) {
        continue;
      }
      // Remove this if you'd like to produce an UTF8 version of the list
      if (/ă|î|â|ț|ș/.test(strWord)) {
        continue;
      }
    
      arrMatchingWords.push(strWord);
      strPrevWord = strWord;
    }

    arrWords = arrWords.concat(arrMatchingWords);

    resolve(arrWords.length);
  });
}

/*
 * Gets all the two letter search strings with wildcard, for all letters A to Z e.g.
 * 'aa*', 'ab*', 'ac*', ... , 'zx*', 'zy*', 'zz*'
 * and then makes a search page request to the dexonline.ro DEX '09 search URL e.g.
 * https://dexonline.ro/definitie-dex09/ab*
 */
async function getNextRequestParam(url) {
  // Gets the two letter search string without wildcard
  const strInput = url.match(/(\w{2}\*)/)[0].replace('*', '');
  // Gets the letter codes for the first and second character in the search string
  const numLetterCode = strInput.charCodeAt(0);
  const numSecondaryLetterCode = strInput.charCodeAt(1);

  const nextFirstLetter = String.fromCharCode(numLetterCode + 1);
  const nextSecondaryLetter = String.fromCharCode(numSecondaryLetterCode + 1);

  /*
    Both search string characters are 'z', which means we're done!
    At this point, we can write all the data to the file.
  */
  if (numLetterCode === 122 && numSecondaryLetterCode === 122) {
    const file = fs.createWriteStream(SAVE_FILE_NAME);

    console.log(`***\n*** The end: ${arrWords.length} occurrences.\n***`);

    file.on('error', (err) => {
      /* error handling */
    });
    arrWords.forEach((word) => {
      file.write(word + '\n');
    });
    file.end();

    // Returning `true` will solve the Promise
    return true;
  }
  /*
    Secondary letter is 'z', which means we can move to the next letter e.g.
    going from 'az' to 'ba'
  */
  if (numSecondaryLetterCode + 1 > 122) {
    console.log(`***\n*** Finished letter: "${strInput[0]}"\n***`);
    console.log(`***\n*** Starting letter: "${nextFirstLetter}"\n***`);
    console.log(`*** Fetching: ${nextFirstLetter}a`);

    await requestPage(`${DICT_SEARCH_URL}${nextFirstLetter}a*`);
  } else {
    /*
      Otherwise, we just proceed by moving on to the next secondary letter e.g.
      going from 'ba' to 'bb'
    */
    console.log(`*** Fetching: ${strInput[0]}${nextSecondaryLetter}`);

    await requestPage(`${DICT_SEARCH_URL}${strInput[0]}${nextSecondaryLetter}*`);
  }
}

/*
 * Requests the dictionary page recursively in a promise,
 * until we've reached the very and and can resolve.
 */
async function requestPage(url) {
  return new Promise((resolve) => {
    request(url, async function (error, response, body) {
      if (!error) {
        await parseDictHtml(body);
      }
    }).then(() => {
      if (getNextRequestParam(url)) {
        resolve();
      }
    }).catch((err) => {
      if (err.statusCode === 404) {
        if (getNextRequestParam(url)) {
          resolve();
        }
      }
    });
  });
}

// Start with the page request below
requestPage(`${DICT_SEARCH_URL}${DICT_SEARCH_START_QUERY}`);