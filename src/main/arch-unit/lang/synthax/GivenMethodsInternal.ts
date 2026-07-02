import { DescribedPredicate } from '../../base/DescribedPredicate';
import { TypeScriptMethod } from '../../core/domain/TypeScriptMethod';
import { AllowEmptyShould } from '../AllowEmptyShould';
import { ArchCondition } from '../ArchCondition';
import { MethodsTransformer } from '../MethodsTransformer';

import { ConditionAggregator } from './ConditionAggregator';
import { GivenMethods } from './elements/GivenMethods';
import { GivenMethodsConjunction } from './elements/GivenMethodsConjunction';
import { MethodsShould } from './elements/MethodsShould';
import { MethodsThat } from './elements/MethodsThat';
import { MethodsShouldInternal } from './MethodsShouldInternal';
import { MethodsThatInternal } from './MethodsThatInternal';
import { PredicateAggregator } from './PredicateAggregator';

export class GivenMethodsInternal implements GivenMethods, GivenMethodsConjunction {
  private readonly methodsTransformer: MethodsTransformer;
  private readonly prepareCondition: (condition: ArchCondition<TypeScriptMethod>) => ArchCondition<TypeScriptMethod>;

  constructor(
    methodsTransformer: MethodsTransformer,
    prepareCondition: (condition: ArchCondition<TypeScriptMethod>) => ArchCondition<TypeScriptMethod>
  ) {
    this.methodsTransformer = methodsTransformer;
    this.prepareCondition = prepareCondition;
  }

  static default(): GivenMethodsInternal {
    return new GivenMethodsInternal(
      new MethodsTransformer('methods', PredicateAggregator.default()),
      (condition: ArchCondition<TypeScriptMethod>) => condition
    );
  }

  that(): MethodsThat<GivenMethodsConjunction> {
    return new MethodsThatInternal(
      (predicate: DescribedPredicate<TypeScriptMethod>) =>
        new GivenMethodsInternal(this.methodsTransformer.addPredicate(predicate), this.prepareCondition)
    );
  }

  should(): MethodsShould {
    return new MethodsShouldInternal(
      this.methodsTransformer,
      ConditionAggregator.default(),
      this.prepareCondition,
      AllowEmptyShould.asConfigured()
    );
  }

  and(): MethodsThat<GivenMethodsConjunction> {
    return new MethodsThatInternal(
      (predicate: DescribedPredicate<TypeScriptMethod>) =>
        new GivenMethodsInternal(this.methodsTransformer.switchModeAnd().addPredicate(predicate), this.prepareCondition)
    );
  }

  or(): MethodsThat<GivenMethodsConjunction> {
    return new MethodsThatInternal(
      (predicate: DescribedPredicate<TypeScriptMethod>) =>
        new GivenMethodsInternal(this.methodsTransformer.switchModeOr().addPredicate(predicate), this.prepareCondition)
    );
  }
}
