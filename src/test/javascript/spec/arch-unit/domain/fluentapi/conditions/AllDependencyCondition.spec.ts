import { ConditionEvent } from '../../../../../../../main/arch-unit/domain/fluentapi/ConditionEvent';
import { AllDependencyCondition } from '../../../../../../../main/arch-unit/domain/fluentapi/conditions/AllDependencyCondition';
import { SimpleConditionEvents } from '../../../../../../../main/arch-unit/domain/fluentapi/SimpleConditionEvents';
import { TypeScriptClassFixture } from '../../TypeScriptClassFixture';
import { DescribedPredicateFixture } from '../DescribedPredicateFixture';

describe('AllDependencyCondition', () => {
  describe('check', () => {
    it('should add violation', () => {
      const allDependencyCondition = new AllDependencyCondition('', DescribedPredicateFixture.packageMatchesPredicate(['jambon'], ''));
      const conditionEvents = new SimpleConditionEvents();
      allDependencyCondition.check(TypeScriptClassFixture.fruit(), conditionEvents);
      expect(conditionEvents.getViolating()).toEqual([
        new ConditionEvent(
          'Wrong dependency in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts: src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
          true
        ),
        new ConditionEvent(
          'Wrong dependency in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts: src/test/fake-src/business-context-one/domain/fruit/FruitType.ts',
          true
        ),
      ]);
    });
    it('should not add violation', () => {
      const allDependencyCondition = new AllDependencyCondition('', DescribedPredicateFixture.packageMatchesPredicate(['fruit'], ''));
      const conditionEvents = new SimpleConditionEvents();
      allDependencyCondition.check(TypeScriptClassFixture.fruit(), conditionEvents);
      expect(conditionEvents.getViolating()).toEqual([]);
    });
  });
});
