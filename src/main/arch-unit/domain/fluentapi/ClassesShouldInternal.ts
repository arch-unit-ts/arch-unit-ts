import { ArchCondition } from '@/arch-unit/domain/fluentapi/ArchCondition';
import { ArchRule } from '@/arch-unit/domain/fluentapi/ArchRule';
import { ClassesShould } from '@/arch-unit/domain/fluentapi/ClassesShould';
import { ClassesShouldConjunction } from '@/arch-unit/domain/fluentapi/ClassesShouldConjunction';
import { ClassesThat } from '@/arch-unit/domain/fluentapi/ClassesThat';
import { ClassesThatInternal } from '@/arch-unit/domain/fluentapi/ClassesThatInternal';
import { ClassesTransformer } from '@/arch-unit/domain/fluentapi/ClassesTransformer';
import { ConditionEvent } from '@/arch-unit/domain/fluentapi/ConditionEvent';
import { ArchConditions } from '@/arch-unit/domain/fluentapi/conditions/ArchConditions';
import { EvaluationResult } from '@/arch-unit/domain/fluentapi/EvaluationResult';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';
import { Optional } from '@/common/domain/Optional';

export class ClassesShouldInternal implements ArchRule, ClassesShould {
  private readonly classesTransformer: ClassesTransformer;
  private readonly conditionPredicates: ArchCondition<TypeScriptClass>[];
  private overriddenDescription: Optional<string>;

  constructor(classesTransformer: ClassesTransformer, conditionPredicates: ArchCondition<TypeScriptClass>[]) {
    this.classesTransformer = classesTransformer;
    this.conditionPredicates = conditionPredicates;
  }

  because(reason: string): ArchRule {
    this.overriddenDescription = Optional.ofUndefinable(reason);
    return this;
  }

  check(classes: TypeScriptClass[]): void {
    const evaluationResult = this.evaluate(classes);
    if (evaluationResult.hasErrors()) {
      throw new Error(`Architecture violation : ${this.getDescription()}.\nErrors : ${evaluationResult.errorMessage()}`);
    }
  }

  onlyDependOnClassesThat(): ClassesThat<ClassesShouldConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      this.conditionPredicates.push(ArchConditions.dependOnClassesThat(describedPredicate));
      return this;
    });
  }

  evaluate(classes: TypeScriptClass[]): EvaluationResult {
    const classesFiltered = this.classesTransformer.transform(classes);

    const conditionEvents: ConditionEvent[] = [];

    classesFiltered.forEach(typeScriptClass =>
      this.conditionPredicates.forEach(conditionPredicate => conditionPredicate.check(typeScriptClass, conditionEvents))
    );

    return new EvaluationResult(conditionEvents);
  }

  getDescription(): string {
    return this.overriddenDescription.orElse('');
  }
}
