import { ArchRuleDefinition } from './arch-unit/domain/fluentapi/ArchRuleDefinition';
import { GivenClassesInternal } from './arch-unit/domain/fluentapi/GivenClassesInternal';

export const classes = (): GivenClassesInternal => {
  return ArchRuleDefinition.classes();
};

export const noClasses = (): GivenClassesInternal => {
  return ArchRuleDefinition.noClasses();
};
