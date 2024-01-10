import { ReverseDependencies } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';

import { DependencyFixture } from './DependencyFixture';
import { TypeScriptClassFixture } from './TypeScriptClassFixture';

describe('ReverseDependencies', () => {
  const fruitClassContextOne = TypeScriptClassFixture.fruitContextOne();
  const fruitClassContextTwo = TypeScriptClassFixture.fruitContextTwo();
  const clientClass = TypeScriptClassFixture.client();
  const basketClass = TypeScriptClassFixture.basket();
  const fruitApplicationServiceClass = TypeScriptClassFixture.fruitApplicationService();
  const clientNameClass = TypeScriptClassFixture.clientName();
  const fruitContextOneDependency = DependencyFixture.fruitContextOne();
  const clientDependency = DependencyFixture.client();

  it('Should put and get in map', () => {
    const reverseDependencies = new ReverseDependencies();
    reverseDependencies.put(clientClass, fruitContextOneDependency);
    reverseDependencies.put(basketClass, fruitContextOneDependency);
    reverseDependencies.put(fruitApplicationServiceClass, fruitContextOneDependency);
    reverseDependencies.put(clientNameClass, clientDependency);
    expect(reverseDependencies.get(fruitClassContextOne).map(reverseDependency => reverseDependency.owner.name.get())).toEqual([
      'Client.ts',
      'Basket.ts',
      'FruitApplicationService.ts',
    ]);
    expect(reverseDependencies.get(fruitClassContextTwo).map(reverseDependency => reverseDependency.owner.name.get())).toEqual([]);
    expect(reverseDependencies.get(clientClass).map(reverseDependency => reverseDependency.owner.name.get())).toEqual(['ClientName.ts']);
    expect(reverseDependencies.get(TypeScriptClassFixture.fruitJson())).toEqual([]);
  });
});
