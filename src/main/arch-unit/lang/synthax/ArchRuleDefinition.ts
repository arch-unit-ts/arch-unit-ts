import { TypeScriptClass } from '../../core/domain/TypeScriptClass';
import { TypeScriptMethod } from '../../core/domain/TypeScriptMethod';
import { ArchCondition } from '../ArchCondition';
import { ClassesTransformer } from '../ClassesTransformer';
import { ArchConditions } from '../conditions/ArchConditions';
import { MethodsTransformer } from '../MethodsTransformer';

import { GivenClassesInternal } from './GivenClassesInternal';
import { GivenMethodsInternal } from './GivenMethodsInternal';
import { PredicateAggregator } from './PredicateAggregator';

export abstract class ArchRuleDefinition {
  public static classes = (): GivenClassesInternal => {
    return GivenClassesInternal.default();
  };

  public static noClasses = (): GivenClassesInternal => {
    return new GivenClassesInternal(
      new ClassesTransformer('no classes', PredicateAggregator.default()),
      ArchRuleDefinition.negateCondition<TypeScriptClass>()
    );
  };

  public static methods = (): GivenMethodsInternal => {
    return GivenMethodsInternal.default();
  };

  public static noMethods = (): GivenMethodsInternal => {
    return new GivenMethodsInternal(
      new MethodsTransformer('no methods', PredicateAggregator.default()),
      ArchRuleDefinition.negateCondition<TypeScriptMethod>()
    );
  };

  private static negateCondition = function <T>() {
    return (condition: ArchCondition<T>) => ArchConditions.negate(condition);
  };
}
