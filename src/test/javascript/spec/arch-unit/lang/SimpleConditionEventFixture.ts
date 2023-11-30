import { ClassName } from '../../../../../main/arch-unit/core/domain/ClassName';
import { ConditionEvent } from '../../../../../main/arch-unit/lang/ConditionEvent';
import { SimpleConditionEvent } from '../../../../../main/arch-unit/lang/SimpleConditionEvent';

export class SimpleConditionEventFixture {
  static violation = (): ConditionEvent => {
    return new SimpleConditionEvent('description violation 1', true);
  };
  static violation2 = (): ConditionEvent => {
    return new SimpleConditionEvent('description violation 2', true);
  };
  static violationWithClassName = (className: ClassName): ConditionEvent => {
    return new SimpleConditionEvent(`Error in ${className.get()}`, true);
  };
  static ok = (): ConditionEvent => {
    return new SimpleConditionEvent('description ok', false);
  };
}
