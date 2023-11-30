import { ConditionEvents } from '../../../../../main/arch-unit/lang/ConditionEvents';
import { SimpleConditionEvents } from '../../../../../main/arch-unit/lang/SimpleConditionEvents';

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
