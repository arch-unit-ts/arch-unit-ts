import { TypeScriptClass } from '../TypeScriptClass';

import { DescribedPredicate } from './DescribedPredicate';

export class ClassesTransformer {
  private readonly predicates: DescribedPredicate<TypeScriptClass>[];

  constructor(predicates: DescribedPredicate<TypeScriptClass>[]) {
    this.predicates = predicates;
  }

  transform(classes: TypeScriptClass[]): TypeScriptClass[] {
    return classes.filter(aClass => this.predicates.every(predicate => predicate.test(aClass)));
  }
}
