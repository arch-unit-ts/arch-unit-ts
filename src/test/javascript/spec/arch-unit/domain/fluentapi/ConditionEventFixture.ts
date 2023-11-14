import { ConditionEvent } from '@/arch-unit/domain/fluentapi/ConditionEvent';

export class ConditionEventFixture {
  static violation = (): ConditionEvent => {
    return new ConditionEvent('description violation 1', true);
  };
  static violation2 = (): ConditionEvent => {
    return new ConditionEvent('description violation 2', true);
  };
  static ok = (): ConditionEvent => {
    return new ConditionEvent('description ok', false);
  };
}
