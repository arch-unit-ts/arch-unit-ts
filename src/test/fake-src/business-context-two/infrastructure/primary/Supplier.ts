import { BadPackageBasketJson } from '../secondary/BadPackageBasketJson';

import { TypeScriptBasketsAdapter } from './TypeScriptBasketsAdapter';

export class Supplier {
  getBadPackageBasketJson(): BadPackageBasketJson {
    return new BadPackageBasketJson();
  }

  getBasketAmount(): number {
    return new TypeScriptBasketsAdapter().getBasket().amount;
  }
}
