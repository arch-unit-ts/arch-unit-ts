import { Optional } from '../../../common/domain/Optional';
import { PackageMatcher, ResultMatcher } from '../../core/domain/PackageMatcher';
import { TypeScriptClass } from '../../core/domain/TypeScriptClass';

import { SliceAssignment } from './SliceAssignment';
import { SliceIdentifier } from './SliceIdentifier';

export class PackageIdentifierSliceAssignment implements SliceAssignment {
  private readonly packageIdentifier: string;
  private readonly packageMatcher: PackageMatcher;

  constructor(packageIdentifier: string) {
    this.packageMatcher = PackageMatcher.of(packageIdentifier);
    if (!packageIdentifier.includes('(')) {
      throw new Error(
        `Package identifier '${packageIdentifier}' must contain at least one capturing group '(*)' or '(**)' to define slices`
      );
    }
    this.packageIdentifier = packageIdentifier;
  }

  getIdentifierOf(typeScriptClass: TypeScriptClass): Optional<SliceIdentifier> {
    return this.packageMatcher
      .matchExactly(typeScriptClass.packagePath.getDotsPath())
      .map(ResultMatcher.TO_GROUPS)
      .map(groups => SliceIdentifier.of(...groups));
  }

  getDescription(): string {
    return `slices matching '${this.packageIdentifier}'`;
  }
}
