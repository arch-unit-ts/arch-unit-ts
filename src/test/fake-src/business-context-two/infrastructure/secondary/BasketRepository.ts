import { TypeScriptFruitsAdapter } from '../../../business-context-one/infrastructure/primary/TypeScriptFruitsAdapter';

export class BasketRepository {
  getBasketColor(): string {
    return new TypeScriptFruitsAdapter().getFruit().color;
  }
}
