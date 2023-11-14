import { ArchCondition } from '@/arch-unit/domain/fluentapi/ArchCondition';
import { NeverCondition } from '@/arch-unit/domain/fluentapi/conditions/NeverCondition';
import { GivenClassesInternal } from '@/arch-unit/domain/fluentapi/GivenClassesInternal';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export const classes = (): GivenClassesInternal => {
  return GivenClassesInternal.of([]);
};

export const noClasses = (): GivenClassesInternal => {
  return new GivenClassesInternal([], negateCondition());
};

const negateCondition = function () {
  return function (condition: ArchCondition<TypeScriptClass>) {
    return new NeverCondition(condition);
  };
};
