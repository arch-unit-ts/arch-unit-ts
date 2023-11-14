import { PackageMatchesPredicate } from '../../PackageMatchesPredicate';
import { TypeScriptClassFixture } from '../../TypeScriptClassFixture';

import { ConditionEvent } from '@/arch-unit/domain/fluentapi/ConditionEvent';
import { AllDependencyCondition } from '@/arch-unit/domain/fluentapi/conditions/AllDependencyCondition';
import { SimpleConditionEvents } from '@/arch-unit/domain/fluentapi/SimpleConditionEvents';

describe('AllDependencyCondition', () => {
  describe('check', () => {
    it('should add violation', () => {
      const allDependencyCondition = new AllDependencyCondition('', new PackageMatchesPredicate(['jambon'], ''));
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
      const allDependencyCondition = new AllDependencyCondition('', new PackageMatchesPredicate(['fruit'], ''));
      const conditionEvents = new SimpleConditionEvents();
      allDependencyCondition.check(TypeScriptClassFixture.fruit(), conditionEvents);
      expect(conditionEvents.getViolating()).toEqual([]);
    });
  });
});
