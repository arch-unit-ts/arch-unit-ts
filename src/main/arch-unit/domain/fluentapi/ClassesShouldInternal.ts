import { ArchCondition } from '@/arch-unit/domain/fluentapi/ArchCondition';
import { ArchRule } from '@/arch-unit/domain/fluentapi/ArchRule';
import { ClassesShould } from '@/arch-unit/domain/fluentapi/ClassesShould';
import { ClassesShouldConjunction } from '@/arch-unit/domain/fluentapi/ClassesShouldConjunction';
import { ClassesThat } from '@/arch-unit/domain/fluentapi/ClassesThat';
import { ClassesThatInternal } from '@/arch-unit/domain/fluentapi/ClassesThatInternal';
import { ClassesTransformer } from '@/arch-unit/domain/fluentapi/ClassesTransformer';
import { ConditionEvents } from '@/arch-unit/domain/fluentapi/ConditionEvents';
import { ArchConditions } from '@/arch-unit/domain/fluentapi/conditions/ArchConditions';
import { EvaluationResult } from '@/arch-unit/domain/fluentapi/EvaluationResult';
import { SimpleConditionEvents } from '@/arch-unit/domain/fluentapi/SimpleConditionEvents';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';
import { Optional } from '@/common/domain/Optional';

export class ClassesShouldInternal implements ArchRule, ClassesShould {
  private readonly classesTransformer: ClassesTransformer;
  private readonly conditionPredicates: ArchCondition<TypeScriptClass>[];
  private readonly prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>;
  private overriddenDescription: Optional<string>;

  constructor(
    classesTransformer: ClassesTransformer,
    conditionPredicates: ArchCondition<TypeScriptClass>[],
    prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>
  ) {
    this.classesTransformer = classesTransformer;
    this.conditionPredicates = conditionPredicates;
    this.prepareCondition = prepareCondition;
  }

  because(reason: string): ArchRule {
    this.overriddenDescription = Optional.ofUndefinable(reason);
    return this;
  }

  check(classes: TypeScriptClass[]): void {
    const evaluationResult = this.evaluate(classes);
    if (evaluationResult.hasErrors()) {
      throw new Error(`Architecture violation : ${this.getDescription()}.\nErrors : ${evaluationResult.violationReport()}`);
    }
  }

  onlyDependOnClassesThat(): ClassesThat<ClassesShouldConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      // FIXME le prepareCondition ne devrait pas être appliqué sur chaque condition mais uniquement sur une condition finale consolidée
      this.conditionPredicates.push(this.prepareCondition(ArchConditions.onlyDependOnClassesThat(describedPredicate)));
      return this;
    });
  }

  dependOnClassesThat(): ClassesThat<ClassesShouldConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      // FIXME le prepareCondition ne devrait pas être appliqué sur chaque condition mais uniquement sur une condition finale consolidée
      this.conditionPredicates.push(this.prepareCondition(ArchConditions.dependOnClassesThat(describedPredicate)));
      return this;
    });
  }

  evaluate(classes: TypeScriptClass[]): EvaluationResult {
    const classesFiltered = this.classesTransformer.transform(classes);

    const conditionEvents: ConditionEvents = new SimpleConditionEvents();

    classesFiltered.forEach(typeScriptClass =>
      this.conditionPredicates.forEach(conditionPredicate => conditionPredicate.check(typeScriptClass, conditionEvents))
    );

    return new EvaluationResult(conditionEvents);
  }

  getDescription(): string {
    return this.overriddenDescription.orElse('');
  }
}
