import { DescribedPredicate } from '../../base/DescribedPredicate';
import { TypeScriptClass } from '../../core/domain/TypeScriptClass';

import { ClassesThat } from './elements/ClassesThat';

export class ClassesThatInternal<CONJUNCTION> implements ClassesThat<CONJUNCTION> {
  private readonly addPredicate: (predicate: DescribedPredicate<TypeScriptClass>) => CONJUNCTION;

  constructor(addPredicate: (predicate: DescribedPredicate<TypeScriptClass>) => CONJUNCTION) {
    this.addPredicate = addPredicate;
  }

  resideInAPackage(packageIdentifier: string): CONJUNCTION {
    return this.addPredicate(TypeScriptClass.resideInAPackage(packageIdentifier));
  }

  resideInAnyPackage(...packageIdentifiers: string[]): CONJUNCTION {
    return this.addPredicate(TypeScriptClass.resideInAnyPackage(packageIdentifiers));
  }

  haveSimpleNameStartingWith(prefix: string): CONJUNCTION {
    return this.givenWith(TypeScriptClass.simpleNameStartingWith(prefix));
  }

  private givenWith(predicate: DescribedPredicate<TypeScriptClass>): CONJUNCTION {
    return this.addPredicate(predicate);
  }
}
