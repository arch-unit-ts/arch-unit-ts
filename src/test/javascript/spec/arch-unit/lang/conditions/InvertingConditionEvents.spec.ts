import { InvertingConditionEvents } from '../../../../../../main/arch-unit/lang/conditions/InvertingConditionEvents';
import { SimpleConditionEvent } from '../../../../../../main/arch-unit/lang/SimpleConditionEvent';
import { SimpleConditionEvents } from '../../../../../../main/arch-unit/lang/SimpleConditionEvents';
import { SimpleConditionEventFixture } from '../SimpleConditionEventFixture';

describe('InvertingConditionEvents', () => {
  describe('add', () => {
    it('should not add violation', () => {
      const invertingConditionEvents = new InvertingConditionEvents(new SimpleConditionEvents());
      invertingConditionEvents.add(SimpleConditionEventFixture.violation());
      expect(invertingConditionEvents.getViolating().length).toEqual(0);
      expect(invertingConditionEvents.containViolation()).toEqual(false);
    });

    it('should not add ok event', () => {
      const invertingConditionEvents = new InvertingConditionEvents(new SimpleConditionEvents());
      invertingConditionEvents.add(SimpleConditionEventFixture.ok());
      expect(invertingConditionEvents.getViolating()).toEqual([new SimpleConditionEvent('description ok', true)]);
      expect(invertingConditionEvents.containViolation()).toEqual(true);
    });
  });
});
