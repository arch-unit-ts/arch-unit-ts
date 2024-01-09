import { BadPackageBasketJson } from '../infrastructure/secondary/BadPackageBasketJson';

import { Fruit } from '@fake-src/business-context-one/domain/fruit/Fruit';
import { MoneyJson } from '@fake-src/shared-kernel-one/infrastructure/primary/MoneyJson';

export class Basket {
  private readonly fruits: Fruit[];
  private readonly basketJson: BadPackageBasketJson;
  private readonly amount: MoneyJson;
}
