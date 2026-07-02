import { ArchRuleDefinition } from './arch-unit/lang/synthax/ArchRuleDefinition';
import { GivenClassesInternal } from './arch-unit/lang/synthax/GivenClassesInternal';
import { GivenMethodsInternal } from './arch-unit/lang/synthax/GivenMethodsInternal';

export const classes = (): GivenClassesInternal => {
  return ArchRuleDefinition.classes();
};

export const noClasses = (): GivenClassesInternal => {
  return ArchRuleDefinition.noClasses();
};

export const methods = (): GivenMethodsInternal => {
  return ArchRuleDefinition.methods();
};

export const noMethods = (): GivenMethodsInternal => {
  return ArchRuleDefinition.noMethods();
};
