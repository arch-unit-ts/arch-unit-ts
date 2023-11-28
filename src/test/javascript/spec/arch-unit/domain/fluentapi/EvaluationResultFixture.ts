import { SimpleConditionEvents } from '../../../../../../main/arch-unit/domain/fluentapi/conditions/SimpleConditionEvents';
import { EvaluationResult } from '../../../../../../main/arch-unit/domain/fluentapi/EvaluationResult';

import { ConditionEventsFixture } from './ConditionEventsFixture';

export class EvaluationResultFixture {
  static evaluationResult = (): EvaluationResult => {
    return new EvaluationResult(ConditionEventsFixture.simpleConditionEvents());
  };

  static emptyEvaluationResult = (): EvaluationResult => {
    return new EvaluationResult(new SimpleConditionEvents());
  };
}
