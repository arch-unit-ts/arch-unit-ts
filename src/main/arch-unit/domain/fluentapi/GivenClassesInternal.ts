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
    return new ClassesShouldInternal(
      new ClassesTransformer(this.predicateAggregator),
      ConditionAggregator.default(),
      this.prepareCondition
    );
  }

  and(): ClassesThat<GivenClassesConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new GivenClassesInternal(this.predicateAggregator.thatANDs().add(describedPredicate), this.prepareCondition);
    });
  }

  or(): ClassesThat<GivenClassesConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      return new GivenClassesInternal(this.predicateAggregator.thatORs().add(describedPredicate), this.prepareCondition);
    });
  }
}
