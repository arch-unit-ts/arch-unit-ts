/**
 * Locale independent comparators: strings are compared by UTF-16 code unit, like `Array.prototype.sort()` without comparator
 * (uppercase letters come before lowercase ones).
 */
export abstract class Comparators {
  public static compareStrings(first: string, second: string): number {
    if (first < second) {
      return -1;
    }
    return first > second ? 1 : 0;
  }

  public static compareStringArrays(first: string[], second: string[]): number {
    const commonLength = Math.min(first.length, second.length);
    for (let index = 0; index < commonLength; index++) {
      const comparison = Comparators.compareStrings(first[index], second[index]);
      if (comparison !== 0) {
        return comparison;
      }
    }
    return first.length - second.length;
  }
}
