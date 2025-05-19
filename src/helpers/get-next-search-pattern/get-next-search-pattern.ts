export const LAST_SEARCH_PATTERN = 'zz*';

/*
  Gets all the two letter search strings with wildcard,
  for all letters A to Z.
  e.g. 'aa*', 'ab*', 'ac*', ... , 'zx*', 'zy*', 'zz*'
*/
export const getNextSearchPattern = (url: string) => {
  const [searchPattern] = url.match(/(\w{2}\*)/) || [];

  if (!searchPattern || searchPattern === LAST_SEARCH_PATTERN) {
    return null;
  }

  const searchText = searchPattern.replace('*', '').toLowerCase();
  const secondLetterCode = searchText.charCodeAt(1);

  /*
    Secondary letter is 'z', which means we can move to the next letter
    e.g. going from 'az' to 'ba'
  */
  if (secondLetterCode + 1 > 122) {
    const firstLetterCode = searchText.charCodeAt(0);
    const nextFirstLetter = String.fromCharCode(firstLetterCode + 1);

    return `${nextFirstLetter}a*`;
  }

  const [firstLetter] = searchText;
  const nextSecondaryLetter = String.fromCharCode(secondLetterCode + 1);

  /*
    Otherwise, we just proceed by moving on to the next secondary letter e.g.
    going from 'ba' to 'bb'
  */
  return `${firstLetter}${nextSecondaryLetter}*`;
};
