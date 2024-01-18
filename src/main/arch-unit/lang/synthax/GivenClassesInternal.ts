import { DescribedPredicate } from '../../base/DescribedPredicate';
import { TypeScriptClass } from '../../core/domain/TypeScriptClass';
import { AllowEmptyShould } from '../AllowEmptyShould';
import { ArchCondition } from '../ArchCondition';
import { ClassesTransformer } from '../ClassesTransformer';

import { ClassesShouldInternal } from './ClassesShouldInternal';
import { ClassesThatInternal } from './ClassesThatInternal';
import { ConditionAggregator } from './ConditionAggregator';
import { ClassesShould, ClassesShouldConjunction } from './elements/ClassesShould';
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

  thatWithPredicate(predicate: DescribedPredicate<TypeScriptClass>): GivenClassesConjunction {
    return new GivenClassesInternal(this.classesTransformer.addPredicate(predicate), this.prepareCondition);
  }

  should(): ClassesShould {
    return new ClassesShouldInternal(
      this.classesTransformer,
      ConditionAggregator.default(),
      this.prepareCondition,
      AllowEmptyShould.default()
    );
  }

  shouldWithConjunction(condition: ArchCondition<TypeScriptClass>): ClassesShouldConjunction {
    return new ClassesShouldInternal(
      this.classesTransformer,
      ConditionAggregator.default().add(condition),
      this.prepareCondition,
      AllowEmptyShould.default()
    );
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
