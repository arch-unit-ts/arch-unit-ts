import { Dependency } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';

import { ClassNameFixture } from './ClassNameFixture';
import { RelativePathFixture } from './RelativePathFixture';
import { TypeScriptClassFixture } from './TypeScriptClassFixture';

export class DependencyFixture {
  static client = (): Dependency => {
    return Dependency.of(
      ClassNameFixture.client(),
      RelativePathFixture.businessContextOneDomainPackage(),
      TypeScriptClassFixture.fruitContextOne()
    );
  };

  static clientName(): Dependency {
    return Dependency.of(
      ClassNameFixture.clientName(),
      RelativePathFixture.businessContextOneDomainPackage(),
      TypeScriptClassFixture.client()
    );
  }

  static basket(): Dependency {
    return Dependency.of(
      ClassNameFixture.basket(),
      RelativePathFixture.businessContextTwoDomainPackage(),
      TypeScriptClassFixture.fruitContextOne()
    );
  }

  static fruitApplicationService() {
    return Dependency.of(
      ClassNameFixture.fruitApplicationService(),
      RelativePathFixture.businessContextOneApplicationPackage(),
      TypeScriptClassFixture.fruitContextOne()
    );
  }

  static fruitContextOne() {
    return Dependency.of(ClassNameFixture.fruit(), RelativePathFixture.fruitDomainPackageContextOne(), TypeScriptClassFixture.client());
  }
}
