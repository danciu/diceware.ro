import { getSimilarityPercentage } from './get-similarity-percentage.ts';

describe('getSimilarityPercentage()', () => {
  it('should return [100, 100] for identical words', () => {
    const result = getSimilarityPercentage('test', 'test');
    expect(result).toStrictEqual([100, 100]);
  });

  it('should return [0, 0] for completely different words', () => {
    const result = getSimilarityPercentage('apple', 'orange');
    expect(result).toStrictEqual([0, 0]);
  });

  it('should handle words with common prefixes', () => {
    const result = getSimilarityPercentage('testing', 'test');
    expect(result).toStrictEqual([57, 100]);
  });

  it('should handle words where one is a prefix of the other', () => {
    const result = getSimilarityPercentage('pre', 'prefix');
    expect(result).toStrictEqual([50, 100]);
  });

  it('should return [0, 0] for empty strings', () => {
    const result = getSimilarityPercentage('', '');
    expect(result).toStrictEqual([0, 0]);
  });

  it('should return [0, 0] for just one empty string', () => {
    const result1 = getSimilarityPercentage('word', '');
    const result2 = getSimilarityPercentage('', 'word');
    expect(result1).toStrictEqual([0, 0]);
    expect(result2).toStrictEqual([0, 0]);
  });

  it('should handle single character words', () => {
    const result = getSimilarityPercentage('a', 'a');
    expect(result).toStrictEqual([100, 100]);
  });

  it('should handle case sensitivity', () => {
    const result = getSimilarityPercentage('Test', 'test');
    expect(result).toStrictEqual([0, 0]);
  });

  it('should calculate correct percentage when first few characters match', () => {
    const result = getSimilarityPercentage('abcdef', 'abcxyz');
    expect(result).toStrictEqual([50, 50]);
  });

  it('should handle unicode characters', () => {
    const result = getSimilarityPercentage('café', 'cafe');
    expect(result).toStrictEqual([75, 75]);
  });

  it('should handle special characters', () => {
    const result = getSimilarityPercentage('test!', 'test?');
    expect(result).toStrictEqual([80, 80]);
  });

  it('should handle whitespace', () => {
    const result = getSimilarityPercentage('test ', 'test');
    expect(result).toStrictEqual([80, 100]);
  });

  it('should calculate accurate percentages for longer words', () => {
    const result = getSimilarityPercentage('hippopotamus', 'hippocampus');
    expect(result).toStrictEqual([42, 45]);
  });
});
