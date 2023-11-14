import { ConditionEventsFixture } from './ConditionEventsFixture';

import { EvaluationResult } from '@/arch-unit/domain/fluentapi/EvaluationResult';
import { SimpleConditionEvents } from '@/arch-unit/domain/fluentapi/SimpleConditionEvents';

export class EvaluationResultFixture {
  static evaluationResult = (): EvaluationResult => {
    return new EvaluationResult(ConditionEventsFixture.simpleConditionEvents());
  };

  static emptyEvaluationResult = (): EvaluationResult => {
    return new EvaluationResult(new SimpleConditionEvents());
  };
}
