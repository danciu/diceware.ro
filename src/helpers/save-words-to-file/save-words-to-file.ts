import { createWriteStream } from 'fs';

import { DICEWARE_KIT } from '../../constants/constants.ts';

export const SAVE_FILE_NAME = 'words.txt';

/*
  Saves a list of words to a file relative to the root directory.
*/
export const saveWordsToFile = async (
  words: string[],
  path: string,
): Promise<void> => {
  try {
    const saveFilePath = `${path}${SAVE_FILE_NAME}`;
    const finalWords = [...words, ...DICEWARE_KIT];
    const file = createWriteStream(saveFilePath);

    /*
      If you are forking this and will be scraping a much larger dictionary
      of 500K words or more, please consider using chunked writing below.
    */
    file.on('error', (err) => {
      throw new Error(err.message);
    });
    file.write(finalWords.join('\n') + '\n');
    file.end();

    console.log(
      `***\n*** Saved ${finalWords.length} words to ${saveFilePath}\n***`,
    );
  } catch (error) {
    console.log(`!!!\n ERROR: ${error}\n!!!`);
  }
};
