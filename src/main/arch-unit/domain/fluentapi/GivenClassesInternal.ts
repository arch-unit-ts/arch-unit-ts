import { TypeScriptClass } from '../TypeScriptClass';

import { ArchCondition } from './ArchCondition';
import { ClassesShould } from './ClassesShould';
import { ClassesShouldInternal } from './ClassesShouldInternal';
import { ClassesThat } from './ClassesThat';
import { ClassesThatInternal } from './ClassesThatInternal';
import { ClassesTransformer } from './ClassesTransformer';
import { GivenClasses } from './GivenClasses';
import { GivenClassesConjunction } from './GIvenClassesConjunction';
import { PredicateAggregator } from './PredicateAggregator';

export class GivenClassesInternal implements GivenClasses, GivenClassesConjunction {
  private readonly predicateAggregator: PredicateAggregator<TypeScriptClass>;
  private readonly prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>;

  constructor(
    predicateAggregator: PredicateAggregator<TypeScriptClass>,
    prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>
  ) {
    this.predicateAggregator = predicateAggregator;
    this.prepareCondition = prepareCondition;
  }

  static default(): GivenClassesInternal {
    return new GivenClassesInternal(PredicateAggregator.default(), (archCondition: ArchCondition<TypeScriptClass>) => archCondition);
  }

  that(): ClassesThat<GivenClassesConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new GivenClassesInternal(this.predicateAggregator.add(describedPredicate), this.prepareCondition);
    });
  }

  should(): ClassesShould {
    return new ClassesShouldInternal(new ClassesTransformer(this.predicateAggregator), [], this.prepareCondition);
  }
}
