import { GivenSlices } from '../../lang/synthax/elements/GivenSlices';
import { SlicesCreator } from '../../lang/synthax/elements/SlicesCreator';

import { GivenSlicesInternal } from './GivenSlicesInternal';
import { PackageIdentifierSliceAssignment } from './PackageIdentifierSliceAssignment';
import { SliceAssignment } from './SliceAssignment';

export class SlicesCreatorInternal implements SlicesCreator {
  matching(packageIdentifier: string): GivenSlices {
    return new GivenSlicesInternal(new PackageIdentifierSliceAssignment(packageIdentifier));
  }

  assignedFrom(assignment: SliceAssignment): GivenSlices {
    return new GivenSlicesInternal(assignment);
  }
}
