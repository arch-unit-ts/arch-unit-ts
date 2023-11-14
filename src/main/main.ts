import { ArchRuleDefinition } from './arch-unit/domain/fluentapi/ArchRuleDefinition';
import { GivenClassesInternal } from './arch-unit/domain/fluentapi/GivenClassesInternal';

export { TypeScriptProject } from './arch-unit/domain/TypeScriptProject';
export { RelativePath } from './arch-unit/domain/RelativePath';

export const classes = (): GivenClassesInternal => {
  return ArchRuleDefinition.classes();
};

export const noClasses = (): GivenClassesInternal => {
  return ArchRuleDefinition.noClasses();
};
