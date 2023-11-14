import { TypeScriptClass } from '../TypeScriptClass';

import { EvaluationResult } from './EvaluationResult';
import { HasDescription } from './HasDescription';

export interface CanBeEvaluated extends HasDescription {
  evaluate(classes: TypeScriptClass[]): EvaluationResult;
}
