import { ArchRuleDefinition } from './arch-unit/lang/synthax/ArchRuleDefinition';
import { SlicesCreator } from './arch-unit/lang/synthax/elements/SlicesCreator';
import { GivenClassesInternal } from './arch-unit/lang/synthax/GivenClassesInternal';
import { GivenMethodsInternal } from './arch-unit/lang/synthax/GivenMethodsInternal';
import { SlicesRuleDefinition } from './arch-unit/library/dependencies/SlicesRuleDefinition';

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

export const slices = (): SlicesCreator => {
  return SlicesRuleDefinition.slices();
};
