import { Dependency } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';

import { ClassNameFixture } from './ClassNameFixture';
import { RelativePathFixture } from './RelativePathFixture';
import { TypeScriptClassFixture } from './TypeScriptClassFixture';

export class DependencyFixture {
  static client = (): Dependency => {
    return Dependency.of(ClassNameFixture.client(), RelativePathFixture.businessContextOneDomainPackage(), TypeScriptClassFixture.fruit());
  };

  static clientName(): Dependency {
    return Dependency.of(
      ClassNameFixture.clientName(),
      RelativePathFixture.businessContextOneDomainPackage(),
      TypeScriptClassFixture.client()
    );
  }

  static basket(): Dependency {
    return Dependency.of(ClassNameFixture.basket(), RelativePathFixture.businessContextTwoDomainPackage(), TypeScriptClassFixture.fruit());
  }

  static fruitApplicationService() {
    return Dependency.of(
      ClassNameFixture.fruitApplicationService(),
      RelativePathFixture.businessContextOneApplicationPackage(),
      TypeScriptClassFixture.fruit()
    );
  }

  static fruit() {
    return Dependency.of(ClassNameFixture.fruit(), RelativePathFixture.fruitDomainPackage(), TypeScriptClassFixture.client());
  }
}
