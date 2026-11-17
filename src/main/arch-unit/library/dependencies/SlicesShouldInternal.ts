import { SlicesShould } from '../../lang/synthax/elements/SlicesShould';

import { FreeOfCyclesRule } from './FreeOfCyclesRule';
import { SliceAssignment } from './SliceAssignment';

export class SlicesShouldInternal implements SlicesShould {
  private readonly assignment: SliceAssignment;

  constructor(assignment: SliceAssignment) {
    this.assignment = assignment;
  }

  beFreeOfCycles(): FreeOfCyclesRule {
    return new FreeOfCyclesRule(this.assignment);
  }
}
