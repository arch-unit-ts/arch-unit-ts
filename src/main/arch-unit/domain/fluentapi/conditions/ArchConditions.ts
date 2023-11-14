import { ArchCondition } from '@/arch-unit/domain/fluentapi/ArchCondition';
import { AllDependencyCondition } from '@/arch-unit/domain/fluentapi/conditions/AllDependencyCondition';
import { AnyDependencyCondition } from '@/arch-unit/domain/fluentapi/conditions/AnyDependencyCondition';
import { DescribedPredicate } from '@/arch-unit/domain/fluentapi/DescribedPredicate';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export abstract class ArchConditions {
  static onlyDependOnClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return new AllDependencyCondition('only depend on classes that ' + predicate.description, predicate);
  };

  static dependOnClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return new AnyDependencyCondition('depend on classes that ' + predicate.description, predicate);
  };
}
