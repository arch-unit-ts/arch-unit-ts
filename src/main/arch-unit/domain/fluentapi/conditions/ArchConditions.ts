import { ArchCondition } from '@/arch-unit/domain/fluentapi/ArchCondition';
import { AnyDependencyCondition } from '@/arch-unit/domain/fluentapi/conditions/AnyDependencyCondition';
import { DescribedPredicate } from '@/arch-unit/domain/fluentapi/DescribedPredicate';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export abstract class ArchConditions {
  static dependOnClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return new AnyDependencyCondition('only depend on classes that ' + predicate.description, predicate);
  };
}
