import { Optional } from '../../../common/domain/Optional';
import { TypeScriptClass, TypeScriptClasses } from '../../core/domain/TypeScriptClass';
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

  constructor(
    classesTransformer: ClassesTransformer,
    conditionAggregator: ConditionAggregator<TypeScriptClass>,
    prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>
  ) {
    this.classesTransformer = classesTransformer;
    this.conditionAggregator = conditionAggregator;
    this.prepareCondition = prepareCondition;
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
        this.prepareCondition
      );
    });
  }

  dependOnClassesThat(): ClassesThat<ClassesShouldConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new ClassesShouldInternal(
        this.classesTransformer,
        this.conditionAggregator.add(ArchConditions.dependOnClassesThat(describedPredicate)),
        this.prepareCondition
      );
    });
  }

  onlyHaveDependentClassesThat(): ClassesThat<ClassesShouldConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new ClassesShouldInternal(
        this.classesTransformer,
        this.conditionAggregator.add(ArchConditions.onlyHaveDependentClassesThat(describedPredicate)),
        this.prepareCondition
      );
    });
  }

  getDescription(): string {
    return this.overriddenDescription.orElse('');
  }

  evaluate(classes: TypeScriptClasses): EvaluationResult {
    const classesFiltered = this.classesTransformer.transform(classes.get());

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
    return new ClassesShouldInternal(this.classesTransformer, this.conditionAggregator.thatANDs(), this.prepareCondition);
  }

  orShould(): ClassesShould {
    return new ClassesShouldInternal(this.classesTransformer, this.conditionAggregator.thatORs(), this.prepareCondition);
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
      this.prepareCondition
    );
  }
}
