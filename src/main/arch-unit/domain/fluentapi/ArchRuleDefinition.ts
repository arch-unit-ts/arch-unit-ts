import { TypeScriptClass } from '../TypeScriptClass';

import { ArchCondition } from './ArchCondition';
import { NeverCondition } from './conditions/NeverCondition';
import { GivenClassesInternal } from './GivenClassesInternal';

export abstract class ArchRuleDefinition {
  public static classes = (): GivenClassesInternal => {
    return GivenClassesInternal.of([]);
  };

  public static noClasses = (): GivenClassesInternal => {
    return new GivenClassesInternal([], ArchRuleDefinition.negateCondition());
  };

  private static negateCondition = function () {
    return function (condition: ArchCondition<TypeScriptClass>) {
      return new NeverCondition(condition);
    };
  };
}
