import { ConditionEvent } from '@/arch-unit/domain/fluentapi/ConditionEvent';

export interface ConditionEvents {
  add(event: ConditionEvent): void;
  getViolating(): ConditionEvent[];
}
