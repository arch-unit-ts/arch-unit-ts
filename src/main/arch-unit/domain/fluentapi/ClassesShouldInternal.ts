import { Optional } from '../../../common/domain/Optional';
import { TypeScriptClass } from '../TypeScriptClass';

import { ArchCondition } from './ArchCondition';
import { ArchRule } from './ArchRule';
import { ClassesShould } from './ClassesShould';
import { ClassesShouldConjunction } from './ClassesShouldConjunction';
import { ClassesThat } from './ClassesThat';
import { ClassesThatInternal } from './ClassesThatInternal';
import { ClassesTransformer } from './ClassesTransformer';
import { ConditionEvents } from './ConditionEvents';
import { ArchConditions } from './conditions/ArchConditions';
import { EvaluationResult } from './EvaluationResult';
import { SimpleConditionEvents } from './SimpleConditionEvents';

export class ClassesShouldInternal implements ArchRule, ClassesShould {
  private readonly classesTransformer: ClassesTransformer;
  private readonly conditionPredicates: ArchCondition<TypeScriptClass>[];
  private readonly prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>;
  private overriddenDescription: Optional<string> = Optional.empty();

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

  getDescription(): string {
    return this.overriddenDescription.orElse('');
  }

  evaluate(classes: TypeScriptClass[]): EvaluationResult {
    const classesFiltered = this.classesTransformer.transform(classes);

    const conditionEvents: ConditionEvents = new SimpleConditionEvents();

    classesFiltered.forEach(typeScriptClass =>
      this.conditionPredicates.forEach(conditionPredicate => conditionPredicate.check(typeScriptClass, conditionEvents))
    );

    return new EvaluationResult(conditionEvents);
  }
}
