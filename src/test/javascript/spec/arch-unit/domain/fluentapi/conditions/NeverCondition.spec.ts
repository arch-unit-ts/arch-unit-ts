import { AllDependencyCondition } from '../../../../../../../main/arch-unit/domain/fluentapi/conditions/AllDependencyCondition';
import { NeverCondition } from '../../../../../../../main/arch-unit/domain/fluentapi/conditions/NeverCondition';
import { SimpleConditionEvents } from '../../../../../../../main/arch-unit/domain/fluentapi/SimpleConditionEvents';
import { TypeScriptClassFixture } from '../../TypeScriptClassFixture';
import { DescribedPredicateFixture } from '../DescribedPredicateFixture';

describe('NeverCondition', () => {
  describe('check', () => {
    it('should invert condition', () => {
      const allDependencyCondition = new AllDependencyCondition('', DescribedPredicateFixture.packageMatchesPredicate(['jambon'], ''));
      const conditionEvents = new SimpleConditionEvents();
      const neverCondition = new NeverCondition(allDependencyCondition);

      neverCondition.check(TypeScriptClassFixture.fruit(), conditionEvents);
      expect(conditionEvents.getViolating()).toEqual([]);
    });
  });
});
