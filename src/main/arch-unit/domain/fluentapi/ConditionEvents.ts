import { ConditionEvent } from './ConditionEvent';

export interface ConditionEvents {
  add(event: ConditionEvent): void;

  getViolating(): ConditionEvent[];
}
