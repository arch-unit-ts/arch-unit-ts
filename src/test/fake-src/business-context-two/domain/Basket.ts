import { Fruit } from '@fake-src/business-context-one/domain/fruit/Fruit';
import { BasketJson } from '@fake-src/business-context-two/infrastructure/secondary/BasketJson';

export class Basket {
  private readonly fruits: Fruit[];
  private readonly basketJson: BasketJson;
}
