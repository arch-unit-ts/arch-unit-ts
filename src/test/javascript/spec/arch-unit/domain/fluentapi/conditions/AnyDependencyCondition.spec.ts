import { ConditionEvent } from '../../../../../../../main/arch-unit/domain/fluentapi/ConditionEvent';
import { AnyDependencyCondition } from '../../../../../../../main/arch-unit/domain/fluentapi/conditions/AnyDependencyCondition';
import { SimpleConditionEvents } from '../../../../../../../main/arch-unit/domain/fluentapi/SimpleConditionEvents';
import { TypeScriptClassFixture } from '../../TypeScriptClassFixture';
import { DescribedPredicateFixture } from '../DescribedPredicateFixture';

describe('AnyDependencyCondition', () => {
  describe('check', () => {
    it('should add violation', () => {
      const anyDependencyCondition = new AnyDependencyCondition('', DescribedPredicateFixture.packageMatchesPredicate(['jambon'], ''));
      const conditionEvents = new SimpleConditionEvents();
      anyDependencyCondition.check(TypeScriptClassFixture.client(), conditionEvents);
      expect(conditionEvents.getViolating()).toEqual([
        new ConditionEvent(
          'Wrong dependency in src/test/fake-src/business-context-one/domain/Client.ts: src/test/fake-src/business-context-one/domain/ClientName.ts',
          true
        ),
        new ConditionEvent(
          'Wrong dependency in src/test/fake-src/business-context-one/domain/Client.ts: src/test/fake-src/business-context-one/domain/fruit/Fruit.ts',
          true
        ),
      ]);
    });
    it('should not add violation', () => {
      const anyDependencyCondition = new AnyDependencyCondition('', DescribedPredicateFixture.packageMatchesPredicate(['fruit'], ''));
      const conditionEvents = new SimpleConditionEvents();
      anyDependencyCondition.check(TypeScriptClassFixture.client(), conditionEvents);
      expect(conditionEvents.getViolating()).toEqual([]);
    });
  });
});
