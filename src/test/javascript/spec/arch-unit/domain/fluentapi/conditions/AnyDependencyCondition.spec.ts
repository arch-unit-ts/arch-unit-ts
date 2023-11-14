import { PackageMatchesPredicate } from '../../PackageMatchesPredicate';
import { TypeScriptClassFixture } from '../../TypeScriptClassFixture';

import { ConditionEvent } from '@/arch-unit/domain/fluentapi/ConditionEvent';
import { AnyDependencyCondition } from '@/arch-unit/domain/fluentapi/conditions/AnyDependencyCondition';
import { SimpleConditionEvents } from '@/arch-unit/domain/fluentapi/SimpleConditionEvents';

describe('AnyDependencyCondition', () => {
  describe('check', () => {
    it('should add violation', () => {
      const anyDependencyCondition = new AnyDependencyCondition('', new PackageMatchesPredicate(['jambon'], ''));
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
      const anyDependencyCondition = new AnyDependencyCondition('', new PackageMatchesPredicate(['fruit'], ''));
      const conditionEvents = new SimpleConditionEvents();
      anyDependencyCondition.check(TypeScriptClassFixture.client(), conditionEvents);
      expect(conditionEvents.getViolating()).toEqual([]);
    });
  });
});
