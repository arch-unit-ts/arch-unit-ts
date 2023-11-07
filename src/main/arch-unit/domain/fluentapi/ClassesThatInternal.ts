import { ClassesThat } from '@/arch-unit/domain/fluentapi/ClassesThat';
import { DescribedPredicate } from '@/arch-unit/domain/fluentapi/DescribedPredicate';
import { TypeScriptClass } from '@/arch-unit/domain/TypeScriptClass';

export class ClassesThatInternal<CONJUNCTION> implements ClassesThat<CONJUNCTION> {
  private readonly addPredicate: (predicate: DescribedPredicate<TypeScriptClass>) => CONJUNCTION;

  constructor(addPredicate: (predicate: DescribedPredicate<TypeScriptClass>) => CONJUNCTION) {
    this.addPredicate = addPredicate;
  }

  resideInAPackage(packageName: string): CONJUNCTION {
    return this.addPredicate(TypeScriptClass.resideInAPackage(packageName));
  }
}
