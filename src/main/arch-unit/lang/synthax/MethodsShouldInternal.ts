import { Optional } from '../../../common/domain/Optional';
import { DescribedPredicate } from '../../base/DescribedPredicate';
import { TypeScriptClass, TypeScriptClasses } from '../../core/domain/TypeScriptClass';
import { TypeScriptMethod } from '../../core/domain/TypeScriptMethod';
import { AllowEmptyShould } from '../AllowEmptyShould';
import { ArchCondition } from '../ArchCondition';
import { ArchRule } from '../ArchRule';
import { ConditionEvents } from '../ConditionEvents';
import { MethodConditions } from '../conditions/MethodConditions';
import { EvaluationResult } from '../EvaluationResult';
import { MethodsTransformer } from '../MethodsTransformer';
import { SimpleConditionEvents } from '../SimpleConditionEvents';

import { ClassesThatInternal } from './ClassesThatInternal';
import { ConditionAggregator } from './ConditionAggregator';
import { ClassesThat } from './elements/ClassesThat';
import { MethodsShould, MethodsShouldConjunction } from './elements/MethodsShould';

export class MethodsShouldInternal implements ArchRule, MethodsShould, MethodsShouldConjunction {
  private readonly methodsTransformer: MethodsTransformer;
  private readonly conditionAggregator: ConditionAggregator<TypeScriptMethod>;
  private readonly prepareCondition: (condition: ArchCondition<TypeScriptMethod>) => ArchCondition<TypeScriptMethod>;
  private overriddenDescription: Optional<string> = Optional.empty();
  private readonly allowEmptyShouldValue: AllowEmptyShould;

  constructor(
    methodsTransformer: MethodsTransformer,
    conditionAggregator: ConditionAggregator<TypeScriptMethod>,
    prepareCondition: (condition: ArchCondition<TypeScriptMethod>) => ArchCondition<TypeScriptMethod>,
    allowEmptyShould: AllowEmptyShould
  ) {
    this.methodsTransformer = methodsTransformer;
    this.conditionAggregator = conditionAggregator;
    this.prepareCondition = prepareCondition;
    this.allowEmptyShouldValue = allowEmptyShould;
  }

  because(reason: string): ArchRule {
    this.overriddenDescription = Optional.ofUndefinable(reason);
    return this;
  }

  check(classes: TypeScriptClasses): void {
    const evaluationResult = this.evaluate(classes);
    if (evaluationResult.hasErrors()) {
      throw new Error(
        `Architecture violation : Rule ${this.methodsTransformer.getFullDescription()} should ${this.conditionAggregator.getDescription()}${this.reason()}.\nErrors : ${evaluationResult.violationReport()}`
      );
    }
  }

  private reason(): string {
    if (this.getDescription().length === 0) {
      return '';
    }
    return ` because ${this.getDescription()}`;
  }

  getDescription(): string {
    return this.overriddenDescription.orElse('');
  }

  evaluate(classes: TypeScriptClasses): EvaluationResult {
    const methods = this.methodsTransformer.transform(classes.get());

    this.verifyNoEmptyShouldIfEnabled(methods);

    const conditionEvents: ConditionEvents = new SimpleConditionEvents();

    methods.forEach(method =>
      this.conditionAggregator.getCondition().ifPresent(condition => this.prepareCondition(condition).check(method, conditionEvents))
    );

    this.conditionAggregator.getCondition().ifPresent(condition => condition.finish(conditionEvents));

    return new EvaluationResult(conditionEvents);
  }

  beDecoratedWith(decorator: string): MethodsShouldConjunction {
    return this.addCondition(MethodConditions.beDecoratedWith(decorator));
  }

  beDeclaredInClassesThat(): ClassesThat<MethodsShouldConjunction> {
    return new ClassesThatInternal<MethodsShouldConjunction>((classPredicate: DescribedPredicate<TypeScriptClass>) =>
      this.addCondition(MethodConditions.beDeclaredInClassThat(classPredicate))
    );
  }

  orShould(): MethodsShould {
    return new MethodsShouldInternal(
      this.methodsTransformer,
      this.conditionAggregator.thatORs(),
      this.prepareCondition,
      this.allowEmptyShouldValue
    );
  }

  andShould(): MethodsShould {
    return new MethodsShouldInternal(
      this.methodsTransformer,
      this.conditionAggregator.thatANDs(),
      this.prepareCondition,
      this.allowEmptyShouldValue
    );
  }

  allowEmptyShould(allow: boolean): MethodsShouldConjunction {
    return new MethodsShouldInternal(
      this.methodsTransformer,
      this.conditionAggregator,
      this.prepareCondition,
      AllowEmptyShould.fromBoolean(allow)
    );
  }

  private addCondition(condition: ArchCondition<TypeScriptMethod>): MethodsShouldInternal {
    return new MethodsShouldInternal(
      this.methodsTransformer,
      this.conditionAggregator.add(condition),
      this.prepareCondition,
      this.allowEmptyShouldValue
    );
  }

  private verifyNoEmptyShouldIfEnabled(methods: TypeScriptMethod[]): void {
    if (methods.length === 0 && !this.allowEmptyShouldValue.isAllowed()) {
      throw new Error(
        `Rule '${this.getDescription()}' failed to check any methods. ` +
          'This means either that no methods have been passed to the rule at all, ' +
          'or that no methods passed to the rule matched the `that()` clause. ' +
          'To allow rules being evaluated without checking any methods you can ' +
          "use '.allowEmptyShould(true)' on a single rule or use the default configuration."
      );
    }
  }
}
