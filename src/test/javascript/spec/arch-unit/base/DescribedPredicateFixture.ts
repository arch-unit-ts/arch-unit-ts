import { DescribedPredicate } from '../../../../../main/arch-unit/base/DescribedPredicate';
import { TypeScriptClass } from '../../../../../main/arch-unit/core/domain/TypeScriptClass';

export class DescribedPredicateFixture {
  static packageMatchesPredicate = (packageIdentifiers: string[], description: string): DescribedPredicate<TypeScriptClass> =>
    new PackageMatchesPredicate(packageIdentifiers, description);

  static okPredicate = (): DescribedPredicate<TypeScriptClass> => new OkPredicate("I'm ok");
  static koPredicate = (): DescribedPredicate<TypeScriptClass> => new KoPredicate("I'm ko");
}

class OkPredicate extends DescribedPredicate<TypeScriptClass> {
  constructor(description: string) {
    super(description);
  }

  test(): boolean {
    return true;
  }
}

class KoPredicate extends DescribedPredicate<TypeScriptClass> {
  constructor(description: string) {
    super(description);
  }

  test(): boolean {
    return false;
  }
}

class PackageMatchesPredicate extends DescribedPredicate<TypeScriptClass> {
  packageIdentifiers: string[];

  constructor(packageIdentifiers: string[], description: string) {
    super(description);
    this.packageIdentifiers = packageIdentifiers;
  }

  test(typeScriptClass: TypeScriptClass): boolean {
    return this.packageIdentifiers.some(packageIdentifier => typeScriptClass.packagePath.contains(packageIdentifier));
  }
}
