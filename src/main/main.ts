import { ArchRuleDefinition } from './arch-unit/lang/synthax/ArchRuleDefinition';
import { GivenClassesInternal } from './arch-unit/lang/synthax/GivenClassesInternal';

export const classes = (): GivenClassesInternal => {
  return ArchRuleDefinition.classes();
};

export const noClasses = (): GivenClassesInternal => {
  return ArchRuleDefinition.noClasses();
};
