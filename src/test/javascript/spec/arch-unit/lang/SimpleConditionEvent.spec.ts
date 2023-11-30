import { SimpleConditionEventFixture } from './SimpleConditionEventFixture';

describe('SimpleConditionEvent', () => {
  describe('invert', () => {
    it('should invert violation', () => {
      const conditionEvent = SimpleConditionEventFixture.violation();
      const invertedConditionEvent = conditionEvent.invert();

      expect(invertedConditionEvent.isViolation()).toEqual(false);
    });
  });
});
