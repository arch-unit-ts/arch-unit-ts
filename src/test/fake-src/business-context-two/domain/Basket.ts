import { Fruit } from '@fake-src/business-context-one/domain/fruit/Fruit';
import { BasketJson } from '@fake-src/business-context-two/infrastructure/secondary/BasketJson';
import { MoneyJson } from '@fake-src/shared-kernel-one/infrastructure/primary/MoneyJson';

export class Basket {
  private readonly fruits: Fruit[];
  private readonly basketJson: BasketJson;
  private readonly amount: MoneyJson;
}
