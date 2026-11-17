import { FreeOfCyclesRule } from '../../../library/dependencies/FreeOfCyclesRule';

export interface SlicesShould {
  beFreeOfCycles(): FreeOfCyclesRule;
}
