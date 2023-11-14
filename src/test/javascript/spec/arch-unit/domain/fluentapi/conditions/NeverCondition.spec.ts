import { PackageMatchesPredicate } from '../../PackageMatchesPredicate';
import { TypeScriptClassFixture } from '../../TypeScriptClassFixture';

import { AllDependencyCondition } from '@/arch-unit/domain/fluentapi/conditions/AllDependencyCondition';
import { NeverCondition } from '@/arch-unit/domain/fluentapi/conditions/NeverCondition';
import { SimpleConditionEvents } from '@/arch-unit/domain/fluentapi/SimpleConditionEvents';

describe('NeverCondition', () => {
  describe('check', () => {
    it('should invert condition', () => {
      const allDependencyCondition = new AllDependencyCondition('', new PackageMatchesPredicate(['jambon'], ''));
      const conditionEvents = new SimpleConditionEvents();
      const neverCondition = new NeverCondition(allDependencyCondition);

      neverCondition.check(TypeScriptClassFixture.fruit(), conditionEvents);
      expect(conditionEvents.getViolating()).toEqual([]);
    });
  });
});
