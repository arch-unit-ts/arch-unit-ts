import { ArchCondition } from '../../../../../../../main/arch-unit/domain/fluentapi/ArchCondition';
import { AllDependencyCondition } from '../../../../../../../main/arch-unit/domain/fluentapi/conditions/AllDependencyCondition';
import { AnyDependencyCondition } from '../../../../../../../main/arch-unit/domain/fluentapi/conditions/AnyDependencyCondition';
import { ArchConditions } from '../../../../../../../main/arch-unit/domain/fluentapi/conditions/ArchConditions';
import { TypeScriptClass } from '../../../../../../../main/arch-unit/domain/TypeScriptClass';
import { DescribedPredicateFixture } from '../DescribedPredicateFixture';

describe('ArchConditions', () => {
  describe('onlyDependOnClassesThat', () => {
    it('should build AllDependencyCondition', () => {
      const allDependencyCondition: ArchCondition<TypeScriptClass> = ArchConditions.onlyDependOnClassesThat(
        DescribedPredicateFixture.packageMatchesPredicate([], 'the predicate')
      );

      expect(allDependencyCondition instanceof AllDependencyCondition).toEqual(true);
      expect(allDependencyCondition.description).toEqual('only depend on classes that the predicate');
    });
  });

  describe('dependOnClassesThat', () => {
    it('should build AnyDependencyCondition', () => {
      const anyDependencyCondition: ArchCondition<TypeScriptClass> = ArchConditions.dependOnClassesThat(
        DescribedPredicateFixture.packageMatchesPredicate([], 'the predicate')
      );

      expect(anyDependencyCondition instanceof AnyDependencyCondition).toEqual(true);
      expect(anyDependencyCondition.description).toEqual('depend on classes that the predicate');
    });
  });
});
