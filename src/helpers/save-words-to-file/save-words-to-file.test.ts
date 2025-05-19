import { createWriteStream } from 'fs';

import { saveWordsToFile, SAVE_FILE_NAME } from './save-words-to-file.ts';

const mockFileStream = {
  write: jest.fn(),
  end: jest.fn(),
  on: jest.fn(),
};

jest.mock('fs', () => ({
  createWriteStream: jest.fn(() => mockFileStream),
}));

jest.mock('../../constants/constants.ts', () => ({
  DICEWARE_KIT: [],
}));

describe('saveWordsToFile()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should write words and DICEWARE_KIT to a file', async () => {
    const inputWords = ['apple', 'banana'];
    await saveWordsToFile(inputWords, '/mocked/root/');
    const expectedPath = `/mocked/root/${SAVE_FILE_NAME}`;

    expect(require('fs').createWriteStream).toHaveBeenCalledWith(expectedPath);
    expect(mockFileStream.write).toHaveBeenCalledWith('apple\nbanana\n');
    expect(mockFileStream.end).toHaveBeenCalled();
  });

  it('should handle errors thrown by the file stream', async () => {
    mockFileStream.on.mockImplementationOnce((event, cb) => {
      if (event === 'error') {
        cb(new Error('Stream Error'));
      }
    });
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    await saveWordsToFile(['test'], '/mocked/root/');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Stream Error'),
    );
  });

  it('should handle unexpected exceptions', async () => {
    (createWriteStream as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Unexpected failure');
    });
    const consoleLogSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});
    await saveWordsToFile(['test'], '/mocked/root/');

    expect(consoleLogSpy).toHaveBeenCalledWith(
      expect.stringContaining('Unexpected failure'),
    );
  });
});
