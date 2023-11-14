import { ConditionEventFixture } from './ConditionEventFixture';

import { ConditionEvents } from '@/arch-unit/domain/fluentapi/ConditionEvents';
import { SimpleConditionEvents } from '@/arch-unit/domain/fluentapi/SimpleConditionEvents';

export class ConditionEventsFixture {
  static simpleConditionEvents = (): ConditionEvents => {
    const conditionEvents = new SimpleConditionEvents();
    conditionEvents.add(ConditionEventFixture.ok());
    conditionEvents.add(ConditionEventFixture.violation());
    conditionEvents.add(ConditionEventFixture.violation2());
    return conditionEvents;
  };
}
