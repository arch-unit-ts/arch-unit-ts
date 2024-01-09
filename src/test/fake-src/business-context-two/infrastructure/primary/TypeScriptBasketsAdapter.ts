import { BasketJson } from './BasketJson';

export class TypeScriptBasketsAdapter {
  getBasket(): BasketJson {
    return new BasketJson();
  }
}
