import { ReverseDependencies } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';

import { DependencyFixture } from './DependencyFixture';
import { TypeScriptClassFixture } from './TypeScriptClassFixture';

describe('ReverseDependencies', () => {
  const fruitClass = TypeScriptClassFixture.fruit();
  const clientClass = TypeScriptClassFixture.client();
  const basketClass = TypeScriptClassFixture.basket();
  const fruitApplicationServiceClass = TypeScriptClassFixture.fruitApplicationService();
  const clientNameClass = TypeScriptClassFixture.clientName();
  const fruitDependency = DependencyFixture.fruit();
  const clientDependency = DependencyFixture.client();

  it('Should put and get in map', () => {
    const reverseDependencies = new ReverseDependencies();
    reverseDependencies.put(clientClass, fruitDependency);
    reverseDependencies.put(basketClass, fruitDependency);
    reverseDependencies.put(fruitApplicationServiceClass, fruitDependency);
    reverseDependencies.put(clientNameClass, clientDependency);
    expect(reverseDependencies.get(fruitClass).map(reverseDependency => reverseDependency.owner.name.get())).toEqual([
      'Client.ts',
      'Basket.ts',
      'FruitApplicationService.ts',
    ]);
    expect(reverseDependencies.get(clientClass).map(reverseDependency => reverseDependency.owner.name.get())).toEqual(['ClientName.ts']);
    expect(reverseDependencies.get(TypeScriptClassFixture.fruitJson())).toEqual([]);
  });
});
