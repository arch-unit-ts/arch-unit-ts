import { FreeOfCyclesRule } from './FreeOfCyclesRule';
import { PackageIdentifierSliceAssignment } from './PackageIdentifierSliceAssignment';
import { SliceAssignment } from './SliceAssignment';

export interface SlicesShould {
  beFreeOfCycles(): FreeOfCyclesRule;
}

export interface GivenSlices {
  should(): SlicesShould;
}

export interface SlicesCreator {
  /**
   * Defines slices by the capturing groups '(*)' or '(**)' of a package identifier,
   * e.g. '..myapp.(*)..' makes one slice of each first package under 'myapp'.
   */
  matching(packageIdentifier: string): GivenSlices;

  assignedFrom(assignment: SliceAssignment): GivenSlices;
}

export abstract class SlicesRuleDefinition {
  public static slices = (): SlicesCreator => {
    return {
      matching: (packageIdentifier: string) => SlicesRuleDefinition.given(new PackageIdentifierSliceAssignment(packageIdentifier)),
      assignedFrom: (assignment: SliceAssignment) => SlicesRuleDefinition.given(assignment),
    };
  };

  private static given(assignment: SliceAssignment): GivenSlices {
    return { should: () => ({ beFreeOfCycles: () => new FreeOfCyclesRule(assignment) }) };
  }
}
