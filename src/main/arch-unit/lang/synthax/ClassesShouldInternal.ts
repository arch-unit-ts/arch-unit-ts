import { Optional } from '../../../common/domain/Optional';
import { TypeScriptClass, TypeScriptClasses } from '../../core/domain/TypeScriptClass';
import { AllowEmptyShould } from '../AllowEmptyShould';
import { ArchCondition } from '../ArchCondition';
import { ArchRule } from '../ArchRule';
import { ClassesTransformer } from '../ClassesTransformer';
import { ConditionEvents } from '../ConditionEvents';
import { ArchConditions } from '../conditions/ArchConditions';
import { EvaluationResult } from '../EvaluationResult';
import { SimpleConditionEvents } from '../SimpleConditionEvents';

import { ClassesThatInternal } from './ClassesThatInternal';
import { ConditionAggregator } from './ConditionAggregator';
import { ClassesShould, ClassesShouldConjunction } from './elements/ClassesShould';
import { ClassesThat } from './elements/ClassesThat';

export class ClassesShouldInternal implements ArchRule, ClassesShould, ClassesShouldConjunction {
  private readonly classesTransformer: ClassesTransformer;
  private readonly conditionAggregator: ConditionAggregator<TypeScriptClass>;

  private readonly prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>;
  private overriddenDescription: Optional<string> = Optional.empty();
  private readonly allowEmptyShouldValue: AllowEmptyShould;

  constructor(
    classesTransformer: ClassesTransformer,
    conditionAggregator: ConditionAggregator<TypeScriptClass>,
    prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>,
    allowEmptyShould: AllowEmptyShould
  ) {
    this.classesTransformer = classesTransformer;
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
        `Architecture violation : Rule ${this.classesTransformer.getFullDescription()} should ${this.conditionAggregator.getDescription()} because ${this.getDescription()}.\nErrors : ${evaluationResult.violationReport()}`
      );
    }
  }

  onlyDependOnClassesThat(): ClassesThat<ClassesShouldConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new ClassesShouldInternal(
        this.classesTransformer,
        this.conditionAggregator.add(ArchConditions.onlyDependOnClassesThat(describedPredicate)),
        this.prepareCondition,
        this.allowEmptyShouldValue
      );
    });
  }

  dependOnClassesThat(): ClassesThat<ClassesShouldConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new ClassesShouldInternal(
        this.classesTransformer,
        this.conditionAggregator.add(ArchConditions.dependOnClassesThat(describedPredicate)),
        this.prepareCondition,
        this.allowEmptyShouldValue
      );
    });
  }

  onlyHaveDependentClassesThat(): ClassesThat<ClassesShouldConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new ClassesShouldInternal(
        this.classesTransformer,
        this.conditionAggregator.add(ArchConditions.onlyHaveDependentClassesThat(describedPredicate)),
        this.prepareCondition,
        this.allowEmptyShouldValue
      );
    });
  }

  getDescription(): string {
    return this.overriddenDescription.orElse('');
  }

  evaluate(classes: TypeScriptClasses): EvaluationResult {
    const classesFiltered = this.classesTransformer.transform(classes.get());

    this.verifyNoEmptyShouldIfEnabled(classesFiltered);

    const conditionEvents: ConditionEvents = new SimpleConditionEvents();

    classesFiltered.forEach(typeScriptClass =>
      this.conditionAggregator
        .getCondition()
        .ifPresent(condition => this.prepareCondition(condition).check(typeScriptClass, conditionEvents))
    );

    this.conditionAggregator.getCondition().ifPresent(condition => condition.finish(conditionEvents));

    return new EvaluationResult(conditionEvents);
  }

  andShould(): ClassesShould {
    return new ClassesShouldInternal(
      this.classesTransformer,
      this.conditionAggregator.thatANDs(),
      this.prepareCondition,
      this.allowEmptyShouldValue
    );
  }

  orShould(): ClassesShould {
    return new ClassesShouldInternal(
      this.classesTransformer,
      this.conditionAggregator.thatORs(),
      this.prepareCondition,
      this.allowEmptyShouldValue
    );
  }

  allowEmptyShould(allowEmptyShould: boolean): ClassesShouldConjunction {
    return new ClassesShouldInternal(
      this.classesTransformer,
      this.conditionAggregator.thatORs(),
      this.prepareCondition,
      AllowEmptyShould.of(allowEmptyShould)
    );
  }

  haveSimpleNameStartingWith(prefix: string): ClassesShouldConjunction {
    return this.addCondition(ArchConditions.haveSimpleNameStartingWith(prefix));
  }

  addCondition(condition: ArchCondition<TypeScriptClass>): ClassesShouldInternal {
    return this.copyWithNewCondition(this.conditionAggregator.add(condition));
  }

  copyWithNewCondition(newCondition: ConditionAggregator<TypeScriptClass>): ClassesShouldInternal {
    return new ClassesShouldInternal(
      this.classesTransformer,
      this.conditionAggregator.add(newCondition.getCondition().orElseThrow()),
      this.prepareCondition,
      this.allowEmptyShouldValue
    );
  }

  private verifyNoEmptyShouldIfEnabled(classesFiltered: TypeScriptClass[]) {
    if (classesFiltered.length === 0 && !this.allowEmptyShouldValue.isAllowed()) {
      throw new Error(
        `Rule '${this.getDescription()}' failed to check any classes. ` +
          'This means either that no classes have been passed to the rule at all, ' +
          'or that no classes passed to the rule matched the `that()` clause. ' +
          'To allow rules being evaluated without checking any classes you can ' +
          "use '.allowEmptyShould(true)' on a single rule or use the default configuration."
      );
    }
  }
}
