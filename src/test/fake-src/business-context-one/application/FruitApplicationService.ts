import { Fruit } from '../domain/fruit/Fruit';
import { FruitColor } from '../domain/fruit/FruitColor';
import { FruitType } from '../domain/fruit/FruitType';

export class FruitApplicationService {
  getBlueStrawberry(): Fruit {
    return new Fruit(FruitType.STRAWBERRY, FruitColor.BLUE);
  }
}
