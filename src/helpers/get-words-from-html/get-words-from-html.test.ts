import { JSDOM } from 'jsdom';

import { getWordsFromHtml, DOM_LIST_SELECTOR } from './get-words-from-html.ts';
import { getWordsFromElements } from '../get-words-from-elements/get-words-from-elements.ts';

const mockQuerySelector = jest.fn();

jest.mock('jsdom', () => ({
  JSDOM: jest.fn(() => ({
    window: {
      document: {
        querySelector: mockQuerySelector,
      },
    },
  })),
}));

jest.mock('../get-words-from-elements/get-words-from-elements.ts', () => ({
  getWordsFromElements: jest.fn(),
}));

describe('getWordsFromHtml()', () => {
  beforeEach(() => {
    (getWordsFromElements as jest.Mock).mockReset();
  });

  it('should return an empty array when HTML does not contain word list', () => {
    mockQuerySelector.mockImplementationOnce(() => null);
    const html = '<html><body><div>No word list here</div></body></html>';
    const result = getWordsFromHtml(html);

    expect(JSDOM).toHaveBeenCalledWith(html);
    expect(mockQuerySelector).toHaveBeenCalledWith(DOM_LIST_SELECTOR);
    expect(result).toStrictEqual([]);
    expect(getWordsFromElements).not.toHaveBeenCalled();
  });

  it('should handle empty list element', () => {
    mockQuerySelector.mockImplementationOnce(() => ({
      children: [],
    }));
    getWordsFromHtml('html');

    expect(getWordsFromElements).toHaveBeenCalledWith([]);
  });

  it('should extract all list elements and pass them to getWordsFromElements', () => {
    const mockChildren = ['<li>item1</li>', '<li>item2</li>', '<li>item3</li>'];
    mockQuerySelector.mockImplementationOnce(() => ({
      children: mockChildren,
    }));
    getWordsFromHtml('html');

    expect(getWordsFromElements).toHaveBeenCalledWith(mockChildren);
  });
});
