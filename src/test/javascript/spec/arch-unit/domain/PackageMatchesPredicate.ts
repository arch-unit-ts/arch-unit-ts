import { DescribedPredicate } from '../../../../../main/arch-unit/domain/fluentapi/DescribedPredicate';
import { TypeScriptClass } from '../../../../../main/arch-unit/domain/TypeScriptClass';

export class PackageMatchesPredicate extends DescribedPredicate<TypeScriptClass> {
  packageIdentifiers: string[];

  constructor(packageIdentifiers: string[], description: string) {
    super(description);
    this.packageIdentifiers = packageIdentifiers;
  }

  test(typeScriptClass: TypeScriptClass): boolean {
    return this.packageIdentifiers.some(packageIdentifier => typeScriptClass.packagePath.contains(packageIdentifier));
  }
}
