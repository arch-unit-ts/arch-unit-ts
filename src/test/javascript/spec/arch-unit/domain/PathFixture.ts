import { RelativePath } from '../../../../../main/arch-unit/domain/RelativePath';

export class PathFixture {
  static fruit = (): RelativePath => RelativePath.of('/src/test/fake-src/business-context-one/domain/fruit/Fruit.ts');
  static fruitPackage = (): RelativePath => RelativePath.of('/src/test/fake-src/business-context-one/domain/fruit');
}
