import { Comparators } from '../../../../../main/common/domain/Comparators';

describe('Comparators', () => {
  describe('compareStrings', () => {
    it.each([
      ['a', 'b', -1],
      ['b', 'a', 1],
      ['a', 'a', 0],
      ['a', 'ab', -1],
      ['ab', 'a', 1],
      ['B', 'a', -1],
      ['a', 'B', 1],
    ])('should compare %s and %s as %s', (first, second, expected) => {
      expect(Comparators.compareStrings(first, second)).toEqual(expected);
    });

    it('should sort like the default sort', () => {
      const names = ['orders', 'Billing', 'api', 'a-b', 'ab', 'Zebra'];

      expect([...names].sort(Comparators.compareStrings)).toEqual([...names].sort());
    });
  });

  describe('compareStringArrays', () => {
    it('should consider equal arrays as equal', () => {
      expect(Comparators.compareStringArrays(['a', 'b'], ['a', 'b'])).toEqual(0);
      expect(Comparators.compareStringArrays([], [])).toEqual(0);
    });

    it('should compare the first different elements', () => {
      expect(Comparators.compareStringArrays(['a', 'c'], ['a', 'b'])).toBeGreaterThan(0);
      expect(Comparators.compareStringArrays(['a', 'b'], ['b', 'a'])).toBeLessThan(0);
    });

    it('should put the shorter array first when it is a prefix of the other one', () => {
      expect(Comparators.compareStringArrays(['a'], ['a', 'b'])).toBeLessThan(0);
      expect(Comparators.compareStringArrays(['a', 'b'], ['a'])).toBeGreaterThan(0);
    });

    it('should not confuse the elements boundaries', () => {
      expect(Comparators.compareStringArrays(['ab', 'c'], ['a', 'bc'])).toBeGreaterThan(0);
      expect(Comparators.compareStringArrays(['a', 'bc'], ['ab', 'c'])).toBeLessThan(0);
    });
  });
});
