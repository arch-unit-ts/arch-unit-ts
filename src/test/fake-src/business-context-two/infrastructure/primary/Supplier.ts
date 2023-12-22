import { BasketJson } from '@fake-src/business-context-two/infrastructure/secondary/BasketJson';

export class Supplier {
  getBasket(): BasketJson {
    return new BasketJson();
  }
}
