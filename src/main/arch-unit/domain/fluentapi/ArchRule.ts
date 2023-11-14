import { TypeScriptClass } from '../TypeScriptClass';

import { CanBeEvaluated } from './CanBeEvaluated';

export interface ArchRule extends CanBeEvaluated {
  because(reason: string): ArchRule;

  check(classes: TypeScriptClass[]): void;
}
