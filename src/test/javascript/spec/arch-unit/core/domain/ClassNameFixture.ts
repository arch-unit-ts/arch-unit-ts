import { ClassName } from '../../../../../../main/arch-unit/core/domain/ClassName';

export class ClassNameFixture {
  static fruit = (): ClassName => ClassName.of('Fruit.ts');
  static client = (): ClassName => ClassName.of('Client.ts');
  static clientName = (): ClassName => ClassName.of('ClientName.ts');
  static basket = (): ClassName => ClassName.of('Basket.ts');
  static fruitApplicationService = (): ClassName => ClassName.of('FruitApplicationService.ts');
}
