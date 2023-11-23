import {
  AllDependencyCondition,
  AnyDependencyCondition,
  ArchConditions,
} from '../../../../../../../main/arch-unit/domain/fluentapi/conditions/ArchConditions';
import { SimpleConditionEvent } from '../../../../../../../main/arch-unit/domain/fluentapi/SimpleConditionEvent';
import { SimpleConditionEvents } from '../../../../../../../main/arch-unit/domain/fluentapi/SimpleConditionEvents';
import { TypeScriptClassFixture } from '../../TypeScriptClassFixture';
import { ArchConditionFixture } from '../ArchConditionFixture';
import { DescribedPredicateFixture } from '../DescribedPredicateFixture';

describe('ArchConditions', () => {
  describe('onlyDependOnClassesThat', () => {
    describe('check AllDependencyCondition', () => {
      it('should add violation', () => {
        const allDependencyCondition = new AllDependencyCondition('', DescribedPredicateFixture.packageMatchesPredicate(['jambon'], ''));
        const conditionEvents = new SimpleConditionEvents();
        allDependencyCondition.check(TypeScriptClassFixture.fruit(), conditionEvents);
        expect(conditionEvents.getViolating()).toEqual([
          new SimpleConditionEvent(
            'Wrong dependency in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts: src/test/fake-src/business-context-one/domain/fruit/FruitColor.ts',
            true
          ),
          new SimpleConditionEvent(
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

  describe('dependOnClassesThat', () => {
    describe('check AnyDependencyCondition', () => {
      it('should add violation', () => {
        const anyDependencyCondition = new AnyDependencyCondition('', DescribedPredicateFixture.packageMatchesPredicate(['jambon'], ''));
        const conditionEvents = new SimpleConditionEvents();
        anyDependencyCondition.check(TypeScriptClassFixture.client(), conditionEvents);
        expect(conditionEvents.getViolating()).toEqual([
          new SimpleConditionEvent(
            'Wrong dependency in src/test/fake-src/business-context-one/domain/Client.ts: src/test/fake-src/business-context-one/domain/ClientName.ts',
            true
          ),
          new SimpleConditionEvent(
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

  describe('negate', () => {
    describe('check never condition', () => {
      it('should invert condition', () => {
        const koCondition = ArchConditionFixture.koCondition();
        const conditionEvents = new SimpleConditionEvents();

        const neverCondition = ArchConditions.negate(koCondition);

        neverCondition.check(TypeScriptClassFixture.fruit(), conditionEvents);
        expect(conditionEvents.getViolating()).toEqual([]);
      });
    });
  });
});
