import { BasketApplicationService } from '../../application/BasketApplicationService';

import { Supplier } from '@fake-src/business-context-two/infrastructure/primary/Supplier';

export class BadPackageBasketJson {
  readonly amount: number;

  getBasketShape(): BasketApplicationService {
    return new BasketApplicationService();
  }

  getSupplier(): Supplier {
    return new Supplier();
  }
}
