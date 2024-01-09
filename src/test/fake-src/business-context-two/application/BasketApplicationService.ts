import { TypeScriptBasketsAdapter } from '../infrastructure/primary/TypeScriptBasketsAdapter';

export class BasketApplicationService {
  getTypeScriptBasketsAdapter() {
    return new TypeScriptBasketsAdapter();
  }
}
