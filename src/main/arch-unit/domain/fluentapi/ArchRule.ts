import { CanBeEvaluated } from '@/arch-unit/domain/fluentapi/CanBeEvaluated';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export interface ArchRule extends CanBeEvaluated {
  because(reason: string): ArchRule;

  check(classes: TypeScriptClass[]): void;
}
