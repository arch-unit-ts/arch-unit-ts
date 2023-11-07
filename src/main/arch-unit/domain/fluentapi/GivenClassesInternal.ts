import { ClassesShould } from '@/arch-unit/domain/fluentapi/ClassesShould';
import { ClassesShouldInternal } from '@/arch-unit/domain/fluentapi/ClassesShouldInternal';
import { ClassesThat } from '@/arch-unit/domain/fluentapi/ClassesThat';
import { ClassesThatInternal } from '@/arch-unit/domain/fluentapi/ClassesThatInternal';
import { ClassesTransformer } from '@/arch-unit/domain/fluentapi/ClassesTransformer';
import { DescribedPredicate } from '@/arch-unit/domain/fluentapi/DescribedPredicate';
import { GivenClasses } from '@/arch-unit/domain/fluentapi/GivenClasses';
import { GivenClassesConjunction } from '@/arch-unit/domain/fluentapi/GIvenClassesConjunction';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export class GivenClassesInternal implements GivenClasses {
  private readonly predicates: DescribedPredicate<TypeScriptClass>[];

  constructor(predicates: DescribedPredicate<TypeScriptClass>[]) {
    this.predicates = predicates;
  }

  that(): ClassesThat<GivenClassesConjunction> {
    return new ClassesThatInternal(describedPredicate => {
      this.predicates.push(describedPredicate);
      return this;
    });
  }

  should(): ClassesShould {
    return new ClassesShouldInternal(new ClassesTransformer(this.predicates), []);
  }
}
