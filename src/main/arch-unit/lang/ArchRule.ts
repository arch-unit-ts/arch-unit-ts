import { TypeScriptClasses } from '../core/domain/TypeScriptClass';

import { CanBeEvaluated } from './CanBeEvaluated';

export interface ArchRule extends CanBeEvaluated {
  because(reason: string): ArchRule;

  check(classes: TypeScriptClasses): void;
}
