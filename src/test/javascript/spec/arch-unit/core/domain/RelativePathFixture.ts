import { RelativePath } from '../../../../../../main/arch-unit/core/domain/RelativePath';

export class RelativePathFixture {
  static fruit = (): RelativePath => RelativePath.of('src/test/fake-src/business-context-one/domain/fruit/Fruit.ts');
  static fruitDomainPackageContextOne = (): RelativePath => RelativePath.of('src/test/fake-src/business-context-one/domain/fruit');
  static businessContextOneDomainPackage = (): RelativePath => RelativePath.of('src/test/fake-src/business-context-one/domain');
  static businessContextOneApplicationPackage = (): RelativePath => RelativePath.of('src/test/fake-src/business-context-one/application');
  static businessContextTwoDomainPackage = (): RelativePath => RelativePath.of('src/test/fake-src/business-context-two/domain');
}
