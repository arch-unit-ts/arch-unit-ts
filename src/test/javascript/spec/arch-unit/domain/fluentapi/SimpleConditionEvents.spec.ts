import { SimpleConditionEvents } from '../../../../../../main/arch-unit/domain/fluentapi/SimpleConditionEvents';

import { ConditionEventFixture } from './ConditionEventFixture';

describe('SimpleConditionEvent', () => {
  describe('add', () => {
    it('should add violation', () => {
      const simpleConditionEvents = new SimpleConditionEvents();
      simpleConditionEvents.add(ConditionEventFixture.violation());
      expect(simpleConditionEvents.getViolating()).toEqual([ConditionEventFixture.violation()]);
    });

    it('should not add ok event', () => {
      const simpleConditionEvents = new SimpleConditionEvents();
      simpleConditionEvents.add(ConditionEventFixture.ok());
      expect(simpleConditionEvents.getViolating.length).toEqual(0);
    });
  });
});
