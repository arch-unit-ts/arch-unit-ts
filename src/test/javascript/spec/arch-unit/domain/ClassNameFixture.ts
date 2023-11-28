import { ClassName } from '../../../../../main/arch-unit/domain/ClassName';

export class ClassNameFixture {
  static fruit = (): ClassName => ClassName.of('Fruit.ts');
}
