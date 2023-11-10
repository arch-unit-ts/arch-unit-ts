import { RelativePath } from '@/arch-unit/domain/RelativePath';

export class PathFixture {
  static fruit = (): RelativePath => RelativePath.of('/src/test/fake-src/business-context-one/domain/fruit/Fruit.ts');
}
