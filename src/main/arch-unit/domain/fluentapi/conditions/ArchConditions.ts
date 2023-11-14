import { TypeScriptClass } from '../../TypeScriptClass';
import { ArchCondition } from '../ArchCondition';
import { DescribedPredicate } from '../DescribedPredicate';

import { AllDependencyCondition } from './AllDependencyCondition';
import { AnyDependencyCondition } from './AnyDependencyCondition';

export abstract class ArchConditions {
  static onlyDependOnClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return new AllDependencyCondition('only depend on classes that ' + predicate.description, predicate);
  };

  static dependOnClassesThat = (predicate: DescribedPredicate<TypeScriptClass>): ArchCondition<TypeScriptClass> => {
    return new AnyDependencyCondition('depend on classes that ' + predicate.description, predicate);
  };
}
