import { ViolatedAndSatisfiedConditionEvents } from '../../../../../../main/arch-unit/lang/conditions/ViolatedAndSatisfiedConditionEvents';
import { SimpleConditionEventFixture } from '../SimpleConditionEventFixture';

describe('ViolatedAndSatisfiedCOnditionEvents', () => {
  describe('add', () => {
    it('should add events', () => {
      const violatedAndSatisfiedConditionEvents = new ViolatedAndSatisfiedConditionEvents();
      violatedAndSatisfiedConditionEvents.add(SimpleConditionEventFixture.violation());
      violatedAndSatisfiedConditionEvents.add(SimpleConditionEventFixture.ok());
      expect(violatedAndSatisfiedConditionEvents.getViolating()).toEqual([SimpleConditionEventFixture.violation()]);
      expect(violatedAndSatisfiedConditionEvents.getAllowed()).toEqual([SimpleConditionEventFixture.ok()]);
    });
  });
});
