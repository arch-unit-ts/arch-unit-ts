import { TypeScriptClass } from '../../core/domain/TypeScriptClass';
import { ArchCondition } from '../ArchCondition';
import { ClassesTransformer } from '../ClassesTransformer';
import { ArchConditions } from '../conditions/ArchConditions';

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
