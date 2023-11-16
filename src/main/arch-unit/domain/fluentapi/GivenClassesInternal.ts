import { TypeScriptClass } from '../TypeScriptClass';

import { ArchCondition } from './ArchCondition';
import { ClassesShould } from './ClassesShould';
import { ClassesShouldInternal } from './ClassesShouldInternal';
import { ClassesThat } from './ClassesThat';
import { ClassesThatInternal } from './ClassesThatInternal';
import { ClassesTransformer } from './ClassesTransformer';
import { DescribedPredicate } from './DescribedPredicate';
import { GivenClasses } from './GivenClasses';
import { GivenClassesConjunction } from './GIvenClassesConjunction';

export class GivenClassesInternal implements GivenClasses {
  private readonly predicates: DescribedPredicate<TypeScriptClass>[];
  private readonly prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>;

  constructor(prepareCondition: (archCondition: ArchCondition<TypeScriptClass>) => ArchCondition<TypeScriptClass>) {
    this.predicates = [];
    this.prepareCondition = prepareCondition;
  }

  static withoutPrepareCondition(): GivenClassesInternal {
    return new GivenClassesInternal((archCondition: ArchCondition<TypeScriptClass>) => archCondition);
  }

  that(): ClassesThat<GivenClassesConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      this.predicates.push(describedPredicate);
      return this;
    });
  }

  should(): ClassesShould {
    return new ClassesShouldInternal(new ClassesTransformer(this.predicates), [], this.prepareCondition);
  }
}
