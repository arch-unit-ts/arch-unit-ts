import { ConditionEvents } from '../../../../../../main/arch-unit/domain/fluentapi/ConditionEvents';
import { SimpleConditionEvents } from '../../../../../../main/arch-unit/domain/fluentapi/SimpleConditionEvents';

import { SimpleConditionEventFixture } from './SimpleConditionEventFixture';

export class ConditionEventsFixture {
  static simpleConditionEvents = (): ConditionEvents => {
    const conditionEvents = new SimpleConditionEvents();
    conditionEvents.add(SimpleConditionEventFixture.ok());
    conditionEvents.add(SimpleConditionEventFixture.violation());
    conditionEvents.add(SimpleConditionEventFixture.violation2());
    return conditionEvents;
  };
}
