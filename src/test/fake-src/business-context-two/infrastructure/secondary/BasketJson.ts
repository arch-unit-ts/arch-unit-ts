import { BasketApplicationService } from '../../application/BasketApplicationService';

import { Supplier } from '@fake-src/business-context-two/infrastructure/primary/Supplier';

export class BasketJson {
  getBasketShape(): BasketApplicationService {
    return new BasketApplicationService();
  }

  getSupplier(): Supplier {
    return new Supplier();
  }
}
