import { GivenSlices } from '../../lang/synthax/elements/GivenSlices';
import { SlicesShould } from '../../lang/synthax/elements/SlicesShould';

import { SliceAssignment } from './SliceAssignment';
import { SlicesShouldInternal } from './SlicesShouldInternal';

export class GivenSlicesInternal implements GivenSlices {
  private readonly assignment: SliceAssignment;

  constructor(assignment: SliceAssignment) {
    this.assignment = assignment;
  }

  should(): SlicesShould {
    return new SlicesShouldInternal(this.assignment);
  }
}
