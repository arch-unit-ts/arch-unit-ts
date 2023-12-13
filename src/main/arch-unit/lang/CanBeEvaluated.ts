import { HasDescription } from '../base/HasDescription';
import { TypeScriptClasses } from '../core/domain/TypeScriptClass';

import { EvaluationResult } from './EvaluationResult';

export interface CanBeEvaluated extends HasDescription {
  evaluate(classes: TypeScriptClasses): EvaluationResult;
}
