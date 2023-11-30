import { HasDescription } from '../base/HasDescription';
import { TypeScriptClass } from '../core/domain/TypeScriptClass';

import { EvaluationResult } from './EvaluationResult';

export interface CanBeEvaluated extends HasDescription {
  evaluate(classes: TypeScriptClass[]): EvaluationResult;
}
