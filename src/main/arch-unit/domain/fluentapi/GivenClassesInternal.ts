import { TypeScriptClass } from '../TypeScriptClass';

import { ClassesShould } from './ClassesShould';
import { ClassesShouldInternal } from './ClassesShouldInternal';
import { ClassesThat } from './ClassesThat';
import { ClassesThatInternal } from './ClassesThatInternal';
import { ClassesTransformer } from './ClassesTransformer';
import { ConditionAggregator } from './ConditionAggregator';
import { ArchCondition } from './conditions/ArchCondition';
import { GivenClasses } from './GivenClasses';
import { GivenClassesConjunction } from './GivenClassesConjunction';
import { PredicateAggregator } from './PredicateAggregator';

export class GivenClassesInternal implements GivenClasses, GivenClassesConjunction {
  private readonly classesTransformer: ClassesTransformer;
  private readonly prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>;

  constructor(
    classesTransformer: ClassesTransformer,
    prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>
  ) {
    this.classesTransformer = classesTransformer;
    this.prepareCondition = prepareCondition;
  }

  static default(): GivenClassesInternal {
    return new GivenClassesInternal(
      new ClassesTransformer('classes', PredicateAggregator.default()),
      (archCondition: ArchCondition<TypeScriptClass>) => archCondition
    );
  }

  that(): ClassesThat<GivenClassesConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new GivenClassesInternal(this.classesTransformer.addPredicate(describedPredicate), this.prepareCondition);
    });
  }

  should(): ClassesShould {
    return new ClassesShouldInternal(this.classesTransformer, ConditionAggregator.default(), this.prepareCondition);
  }

  and(): ClassesThat<GivenClassesConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new GivenClassesInternal(this.classesTransformer.switchModeAnd().addPredicate(describedPredicate), this.prepareCondition);
    });
  }

  or(): ClassesThat<GivenClassesConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new GivenClassesInternal(this.classesTransformer.switchModeOr().addPredicate(describedPredicate), this.prepareCondition);
    });
  }
}
