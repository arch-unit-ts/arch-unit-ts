import { ConditionEvent } from '../../../../../../main/arch-unit/domain/fluentapi/ConditionEvent';
import { InvertingConditionEvents } from '../../../../../../main/arch-unit/domain/fluentapi/InvertingConditionEvents';
import { SimpleConditionEvents } from '../../../../../../main/arch-unit/domain/fluentapi/SimpleConditionEvents';

import { ConditionEventFixture } from './ConditionEventFixture';

describe('InvertingConditionEvents', () => {
  describe('add', () => {
    it('should not add violation', () => {
      const invertingConditionEvents = new InvertingConditionEvents(new SimpleConditionEvents());
      invertingConditionEvents.add(ConditionEventFixture.violation());
      expect(invertingConditionEvents.getViolating().length).toEqual(0);
    });

    it('should not add ok event', () => {
      const invertingConditionEvents = new InvertingConditionEvents(new SimpleConditionEvents());
      invertingConditionEvents.add(ConditionEventFixture.ok());
      expect(invertingConditionEvents.getViolating()).toEqual([new ConditionEvent('description ok', true)]);
    });
  });
});
