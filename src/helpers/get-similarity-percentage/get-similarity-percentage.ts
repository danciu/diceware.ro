/*
  Get the similarity percentage between Word A and Word B:
  Word A % similar to Word B,
  Word B % similar to Word A.
*/
export const getSimilarityPercentage = (
  wordA: string,
  wordB: string,
): [number, number] => {
  if (!wordA || !wordB) {
    return [0, 0];
  }

  const maxLength = Math.max(wordA.length, wordB.length);
  const minLength = Math.min(wordA.length, wordB.length);

  let exactCharMatchLength = 0;

  for (let i = 0; i < maxLength; i++) {
    if (wordA[i] !== wordB[i]) {
      break;
    }

    exactCharMatchLength++;
  }

  return [
    Math.round((exactCharMatchLength / maxLength) * 100),
    Math.round((exactCharMatchLength / minLength) * 100),
  ];
};
