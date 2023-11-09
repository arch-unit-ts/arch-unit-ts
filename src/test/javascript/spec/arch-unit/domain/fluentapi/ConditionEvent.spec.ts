import { ConditionEventFixture } from './ConditionEventFixture';

describe('ConditionEvent', () => {
  describe('invert', () => {
    it('should invert violation', () => {
      const conditionEvent = ConditionEventFixture.violation();
      const invertedConditionEvent = conditionEvent.invert();

      expect(invertedConditionEvent.description).toEqual('description');
      expect(invertedConditionEvent.violation).toEqual(false);
    });
  });
});
