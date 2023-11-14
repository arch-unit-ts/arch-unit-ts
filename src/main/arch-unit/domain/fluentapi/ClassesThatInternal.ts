import { TypeScriptClass } from '../TypeScriptClass';

import { ClassesThat } from './ClassesThat';
import { DescribedPredicate } from './DescribedPredicate';

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
}
