import { TypeScriptClass } from '../../core/domain/TypeScriptClass';
import { ArchCondition } from '../ArchCondition';
import { ClassesTransformer } from '../ClassesTransformer';

import { ClassesShouldInternal } from './ClassesShouldInternal';
import { ClassesThatInternal } from './ClassesThatInternal';
import { ConditionAggregator } from './ConditionAggregator';
import { ClassesShould } from './elements/ClassesShould';
import { ClassesThat } from './elements/ClassesThat';
import { GivenClasses } from './elements/GivenClasses';
import { GivenClassesConjunction } from './elements/GivenClassesConjunction';
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
