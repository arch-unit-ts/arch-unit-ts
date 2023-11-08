import { ArchCondition } from '@/arch-unit/domain/fluentapi/ArchCondition';
import { AllDependencyCondition } from '@/arch-unit/domain/fluentapi/conditions/AllDependencyCondition';
import { DescribedPredicate } from '@/arch-unit/domain/fluentapi/DescribedPredicate';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export abstract class ArchConditions {
  static onlyDependOnClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return new AllDependencyCondition('only depend on classes that ' + predicate.description, predicate);
  };
}
