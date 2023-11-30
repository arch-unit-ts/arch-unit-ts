import { EvaluationResult } from '../../../../../main/arch-unit/lang/EvaluationResult';
import { SimpleConditionEvents } from '../../../../../main/arch-unit/lang/SimpleConditionEvents';

import { ConditionEventsFixture } from './ConditionEventsFixture';

export class EvaluationResultFixture {
  static evaluationResult = (): EvaluationResult => {
    return new EvaluationResult(ConditionEventsFixture.simpleConditionEvents());
  };

  static emptyEvaluationResult = (): EvaluationResult => {
    return new EvaluationResult(new SimpleConditionEvents());
  };
}
