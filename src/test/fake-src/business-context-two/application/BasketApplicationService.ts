import { Supplier } from '../infrastructure/primary/Supplier';

export class BasketApplicationService {
  getSupplier() {
    return new Supplier();
  }
}
