import { DescribedPredicate } from '../../base/DescribedPredicate';
import { TypeScriptClass } from '../../core/domain/TypeScriptClass';
import { TypeScriptMethod } from '../../core/domain/TypeScriptMethod';

import { ClassesThatInternal } from './ClassesThatInternal';
import { ClassesThat } from './elements/ClassesThat';
import { MethodsThat } from './elements/MethodsThat';

export class MethodsThatInternal<CONJUNCTION> implements MethodsThat<CONJUNCTION> {
  private readonly addPredicate: (predicate: DescribedPredicate<TypeScriptMethod>) => CONJUNCTION;

  constructor(addPredicate: (predicate: DescribedPredicate<TypeScriptMethod>) => CONJUNCTION) {
    this.addPredicate = addPredicate;
  }

  arePublic(): CONJUNCTION {
    return this.addPredicate(TypeScriptMethod.arePublic());
  }

  areNotAbstract(): CONJUNCTION {
    return this.addPredicate(TypeScriptMethod.areNotAbstract());
  }

  areAsync(): CONJUNCTION {
    return this.addPredicate(TypeScriptMethod.areAsync());
  }

  areDecoratedWith(decorator: string): CONJUNCTION {
    return this.addPredicate(TypeScriptMethod.areDecoratedWith(decorator));
  }

  areDeclaredInClassesThat(): ClassesThat<CONJUNCTION> {
    return new ClassesThatInternal<CONJUNCTION>((classPredicate: DescribedPredicate<TypeScriptClass>) =>
      this.addPredicate(TypeScriptMethod.areDeclaredInClassThat(classPredicate))
    );
  }
}
