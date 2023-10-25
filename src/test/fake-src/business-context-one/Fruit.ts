import { FruitColor } from './FruitColor';
import { FruitType } from './FruitType';

export class Fruit {
  private readonly type: FruitType;
  private readonly color: FruitColor;

  constructor(type: FruitType, color: FruitColor) {
    this.type = type;
    this.color = color;
  }
}
