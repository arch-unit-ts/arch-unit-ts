import { DescribedPredicate } from '../../base/DescribedPredicate';

import { Formatters } from './Formatters';
import { PackageMatcher } from './PackageMatcher';

export class PackageMatchers extends DescribedPredicate<string> {
  private packageMatchers: Set<PackageMatcher> = new Set<PackageMatcher>();

  constructor(packageIdentifiers: Set<string>) {
    const packageIdentifierJoinedByComma: string = Formatters.joinSingleQuoted(...packageIdentifiers);
    super(`matches any of [${packageIdentifierJoinedByComma}]`);
    packageIdentifiers.forEach(packageIdentifier => {
      this.packageMatchers.add(PackageMatcher.of(packageIdentifier));
    });
  }

  public static of(...packageIdentifiers: string[]): PackageMatchers {
    return PackageMatchers.ofSet(new Set(packageIdentifiers));
  }

  public static ofSet(packageIdentifiers: Set<string>): PackageMatchers {
    return new PackageMatchers(packageIdentifiers);
  }

  test(aPackage: string): boolean {
    let matches: boolean = false;
    this.packageMatchers.forEach(matcher => {
      matches = matches || matcher.matches(aPackage);
    });
    return matches;
  }
}
