import { SliceAssignment } from '../../../library/dependencies/SliceAssignment';

import { GivenSlices } from './GivenSlices';

export interface SlicesCreator {
  /**
   * Defines slices by the capturing groups '(*)' or '(**)' of a package identifier,
   * e.g. '..myapp.(*)..' makes one slice of each first package under 'myapp'.
   */
  matching(packageIdentifier: string): GivenSlices;

  assignedFrom(assignment: SliceAssignment): GivenSlices;
}
