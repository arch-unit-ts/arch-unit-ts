import { TypeScriptClass } from '../TypeScriptClass';

import { ClassesTransformer } from './ClassesTransformer';
import { ArchCondition } from './conditions/ArchCondition';
import { ArchConditions } from './conditions/ArchConditions';
import { GivenClassesInternal } from './GivenClassesInternal';
import { PredicateAggregator } from './PredicateAggregator';

export abstract class ArchRuleDefinition {
  public static classes = (): GivenClassesInternal => {
    return GivenClassesInternal.default();
  };

  public static noClasses = (): GivenClassesInternal => {
    return new GivenClassesInternal(
      new ClassesTransformer('no classes', PredicateAggregator.default()),
      ArchRuleDefinition.negateCondition()
    );
  };

  private static negateCondition = function () {
    return (condition: ArchCondition<TypeScriptClass>) => ArchConditions.negate(condition);
  };
}
