import { ArchConditions } from '../../../../../../main/arch-unit/lang/conditions/ArchConditions';
import { SimpleConditionEvents } from '../../../../../../main/arch-unit/lang/SimpleConditionEvents';
import { DescribedPredicateFixture } from '../../base/DescribedPredicateFixture';
import { TypeScriptClassFixture } from '../../core/domain/TypeScriptClassFixture';
import { ArchConditionFixture } from '../ArchConditionFixture';

describe('ArchConditions', () => {
  describe('onlyDependOnClassesThat', () => {
    describe('check AllDependencyCondition', () => {
      it('should add violation', () => {
        const allDependencyCondition = ArchConditions.onlyDependOnClassesThat(DescribedPredicateFixture.koPredicate());
        const conditionEvents = new SimpleConditionEvents();
        allDependencyCondition.check(TypeScriptClassFixture.fruitContextOne(), conditionEvents);
        expect(conditionEvents.getViolating()[0].getDescriptionLines()).toEqual([
          'Dependency src.test.fake-src.business-context-one.domain.fruit.FruitColor.ts in src.test.fake-src.business-context-one.domain.fruit.Fruit.ts',
          'Dependency src.test.fake-src.business-context-one.domain.fruit.FruitType.ts in src.test.fake-src.business-context-one.domain.fruit.Fruit.ts',
        ]);
      });
      it('should not add violation', () => {
        const allDependencyCondition = ArchConditions.onlyDependOnClassesThat(DescribedPredicateFixture.okPredicate());
        const conditionEvents = new SimpleConditionEvents();
        allDependencyCondition.check(TypeScriptClassFixture.fruitContextOne(), conditionEvents);
        expect(conditionEvents.getViolating()).toEqual([]);
      });
    });
  });

  describe('dependOnClassesThat', () => {
    describe('check AnyDependencyCondition', () => {
      it('should add violation', () => {
        const anyDependencyCondition = ArchConditions.dependOnClassesThat(DescribedPredicateFixture.koPredicate());
        const conditionEvents = new SimpleConditionEvents();
        anyDependencyCondition.check(TypeScriptClassFixture.client(), conditionEvents);
        expect(conditionEvents.getViolating()[0].getDescriptionLines()).toEqual([
          'Dependency src.test.fake-src.business-context-one.domain.ClientName.ts in src.test.fake-src.business-context-one.domain.Client.ts\n' +
            'Dependency src.test.fake-src.business-context-one.domain.fruit.Fruit.ts in src.test.fake-src.business-context-one.domain.Client.ts',
        ]);
      });
      it('should not add violation', () => {
        const anyDependencyCondition = ArchConditions.dependOnClassesThat(DescribedPredicateFixture.okPredicate());
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

        neverCondition.check(TypeScriptClassFixture.fruitContextOne(), conditionEvents);
        expect(conditionEvents.getViolating()).toEqual([]);
      });
    });
  });
});
