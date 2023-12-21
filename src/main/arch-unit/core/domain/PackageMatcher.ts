import { Optional } from '../../../common/domain/Optional';

export class PackageMatcher {
  private static readonly ILLEGAL_ALTERNATION_PATTERN = new RegExp('\\[[^|]*]');
  private static readonly ILLEGAL_NESTED_GROUP_PATTERN: RegExp = new RegExp(
    this.nestedGroupRegex('(', ')', '(') +
      '|' +
      this.nestedGroupRegex('(', ')', '[') +
      '|' +
      this.nestedGroupRegex('[', ']', '(') +
      '|' +
      this.nestedGroupRegex('[', ']', '[')
  );

  private static readonly PACKAGE_CONTROL_SYMBOLS: Array<string> = Array.from(['*', '(', ')', '.', '|', '[', ']']);

  private static readonly OPT_LETTERS_AT_START: string = '(?:^\\w*)?';
  private static readonly OPT_LETTERS_AT_END: string = '(?:\\w*$)?';
  private static readonly ARBITRARY_PACKAGES: string = '\\.(?:\\w+\\.)*';

  private static readonly TWO_DOTS_REGEX: string = `(?:${PackageMatcher.OPT_LETTERS_AT_START}${PackageMatcher.ARBITRARY_PACKAGES}${PackageMatcher.OPT_LETTERS_AT_END})?`;

  private static readonly TWO_STAR_CAPTURE_LITERAL: string = '(**)';
  private static readonly TWO_STAR_CAPTURE_REGEX: string = '(\\w+(?:\\.\\w+)*)';
  static readonly TWO_STAR_REGEX_MARKER: string = '#%#%#';

  private readonly packagePattern: RegExp;

  private constructor(packageIdentifier: string) {
    this.validate(packageIdentifier);
    this.packagePattern = new RegExp(this.convertToRegex(packageIdentifier));
  }

  public static of(packageIdentifier: string): PackageMatcher {
    return new PackageMatcher(packageIdentifier);
  }

  convertToRegex(packageIdentifier: string): string {
    return packageIdentifier
      .replace(new RegExp('\\[(.*?)]', 'g'), '(?:$1)')
      .replaceAll(PackageMatcher.TWO_STAR_CAPTURE_LITERAL, PackageMatcher.TWO_STAR_REGEX_MARKER)
      .replaceAll('*', '\\w+')
      .replaceAll('.', '\\.')
      .replaceAll(PackageMatcher.TWO_STAR_REGEX_MARKER, PackageMatcher.TWO_STAR_CAPTURE_REGEX)
      .replaceAll('\\.\\.', PackageMatcher.TWO_DOTS_REGEX);
  }

  private validate(packageIdentifier: string): void {
    if (packageIdentifier.includes('...')) {
      throw new Error("Package Identifier may not contain more than two '.' in a row");
    }
    if (packageIdentifier.replace('(**)', '').includes('**')) {
      throw new Error("Package Identifier may not contain more than one '*' in a row");
    }
    if (packageIdentifier.includes('(..)')) {
      throw new Error('Package Identifier does not support capturing via (..), use (**) instead');
    }
    if (PackageMatcher.ILLEGAL_ALTERNATION_PATTERN.test(packageIdentifier)) {
      throw new Error("Package Identifier does not allow alternation brackets '[]' without specifying any alternative via '|' inside");
    }
    if (this.containsToplevelAlternation(packageIdentifier)) {
      throw new Error("Package Identifier only supports '|' inside of '[]' or '()'");
    }
    if (PackageMatcher.ILLEGAL_NESTED_GROUP_PATTERN.test(packageIdentifier)) {
      throw new Error("Package Identifier does not support nesting '()' or '[]' within other '()' or '[]'");
    }
    this.validateCharacters(packageIdentifier);
  }

  private containsToplevelAlternation(packageIdentifier: string): boolean {
    const prefixesBeforeAlternation: Array<string> = [];
    for (let alternationIndex = 0; alternationIndex < packageIdentifier.length; alternationIndex++) {
      if (packageIdentifier.charAt(alternationIndex) === '|') {
        prefixesBeforeAlternation.push(packageIdentifier.substring(0, alternationIndex));
      }
    }

    return prefixesBeforeAlternation.some(
      beforeAlternation =>
        this.sameNumberOfOccurrences(beforeAlternation, '(', ')') && this.sameNumberOfOccurrences(beforeAlternation, '[', ']')
    );
  }

  private sameNumberOfOccurrences(word: string, first: string, second: string): boolean {
    return word.split(first).length - 1 === word.split(second).length - 1;
  }

  private validateCharacters(packageIdentifier: string) {
    for (let i = 0; i < packageIdentifier.length; i++) {
      const char: string = packageIdentifier.charAt(i);
      if (!/[a-zA-Z0-9-_$]/.test(char) && !PackageMatcher.PACKAGE_CONTROL_SYMBOLS.includes(char)) {
        throw new Error(
          `Package Identifier ${packageIdentifier} may only consist of valid typescript identifier parts or the symbols '.)(*'`
        );
      }
    }
  }

  public exactMatches(aPackage: string): boolean {
    return new RegExp('^' + this.packagePattern.source + '$').test(aPackage);
  }

  public partialMatches(aPackage: string): boolean {
    return this.packagePattern.test(aPackage);
  }

  public match(aPackage: string): Optional<ResultMatcher> {
    const matcher: RegExpExecArray = this.packagePattern.exec(aPackage);
    return matcher !== null ? Optional.of(new ResultMatcher(matcher)) : Optional.empty();
  }

  private static nestedGroupRegex(outerOpeningChar: string, outerClosingChar: string, nestedOpeningChar: string): string {
    return '\\' + outerOpeningChar + '[^\\' + outerClosingChar + ']*\\' + nestedOpeningChar;
  }
}

export class ResultMatcher {
  private readonly matcher: string[];

  constructor(matcher: string[]) {
    this.matcher = matcher;
  }

  getNumberOfGroups(): number {
    return this.matcher.length - 1;
  }

  getGroup(index: number): string {
    return this.matcher[index];
  }

  static TO_GROUPS(input: ResultMatcher): Array<string> {
    const arrayResultMatchers: Array<string> = [];
    for (let iterator: number = 1; iterator <= input.getNumberOfGroups(); iterator++) {
      arrayResultMatchers.push(input.getGroup(iterator));
    }
    return arrayResultMatchers;
  }
}
