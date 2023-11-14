import { ConditionEvents } from '../../../../../../main/arch-unit/domain/fluentapi/ConditionEvents';
import { SimpleConditionEvents } from '../../../../../../main/arch-unit/domain/fluentapi/SimpleConditionEvents';

import { ConditionEventFixture } from './ConditionEventFixture';

export class ConditionEventsFixture {
  static simpleConditionEvents = (): ConditionEvents => {
    const conditionEvents = new SimpleConditionEvents();
    conditionEvents.add(ConditionEventFixture.ok());
    conditionEvents.add(ConditionEventFixture.violation());
    conditionEvents.add(ConditionEventFixture.violation2());
    return conditionEvents;
  };
}
