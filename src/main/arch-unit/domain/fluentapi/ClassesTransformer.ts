import { DescribedPredicate } from '@/arch-unit/domain/fluentapi/DescribedPredicate';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export class ClassesTransformer {
  private readonly predicates: DescribedPredicate<TypeScriptClass>[];

  constructor(predicates: DescribedPredicate<TypeScriptClass>[]) {
    this.predicates = predicates;
  }

  transform(classes: TypeScriptClass[]): TypeScriptClass[] {
    return classes.filter(aClass => this.predicates.every(predicate => predicate.test(aClass)));
  }
}
