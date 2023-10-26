import { ClientName } from '@fake-src/business-context-one/domain/ClientName';
import { Fruit } from '@fake-src/business-context-one/domain/fruit/Fruit';

export class Client {
  constructor(
    private readonly name: ClientName,
    private readonly fruits: Fruit[]
  ) {}
}
