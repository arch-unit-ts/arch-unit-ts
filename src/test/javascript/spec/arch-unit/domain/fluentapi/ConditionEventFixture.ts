import { ConditionEvent } from '@/arch-unit/domain/fluentapi/ConditionEvent';

export class ConditionEventFixture {
  static violation = (): ConditionEvent => {
    return new ConditionEvent('description', true);
  };
  static ok = (): ConditionEvent => {
    return new ConditionEvent('description', false);
  };
}
