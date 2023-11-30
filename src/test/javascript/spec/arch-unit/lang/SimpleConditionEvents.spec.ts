import { SimpleConditionEvents } from '../../../../../main/arch-unit/lang/SimpleConditionEvents';

import { SimpleConditionEventFixture } from './SimpleConditionEventFixture';

describe('SimpleConditionEvent', () => {
  describe('add', () => {
    it('should add violation', () => {
      const simpleConditionEvents = new SimpleConditionEvents();
      simpleConditionEvents.add(SimpleConditionEventFixture.violation());
      expect(simpleConditionEvents.getViolating()).toEqual([SimpleConditionEventFixture.violation()]);
      expect(simpleConditionEvents.containViolation()).toEqual(true);
    });

    it('should not add ok event', () => {
      const simpleConditionEvents = new SimpleConditionEvents();
      simpleConditionEvents.add(SimpleConditionEventFixture.ok());
      expect(simpleConditionEvents.getViolating.length).toEqual(0);
      expect(simpleConditionEvents.containViolation()).toEqual(false);
    });
  });
});
