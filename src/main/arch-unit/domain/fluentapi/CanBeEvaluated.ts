import { EvaluationResult } from '@/arch-unit/domain/fluentapi/EvaluationResult';
import { HasDescription } from '@/arch-unit/domain/fluentapi/HasDescription';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export interface CanBeEvaluated extends HasDescription {
  evaluate(classes: TypeScriptClass[]): EvaluationResult;
}
