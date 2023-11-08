import { Path } from '@/arch-unit/domain/Path';

export class PathFixture {
  static fruit = (): Path => Path.of('/src/test/fake-src/business-context-one/domain/fruit/Fruit.ts');
}
