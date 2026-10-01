import { PackageIdentifierSliceAssignment } from '../../../../../../main/arch-unit/library/dependencies/PackageIdentifierSliceAssignment';
import { SliceDependencyGraph } from '../../../../../../main/arch-unit/library/dependencies/SliceDependencyGraph';
import { Slices } from '../../../../../../main/arch-unit/library/dependencies/Slices';
import { InMemoryTypeScriptClassesFixture } from '../../morph/InMemoryTypeScriptClassesFixture';

describe('SliceDependencyGraph', () => {
  const graphOf = (sources: Record<string, string>): SliceDependencyGraph =>
    SliceDependencyGraph.of(
      Slices.of(InMemoryTypeScriptClassesFixture.fromSources(sources), new PackageIdentifierSliceAssignment('src.(*)'))
    );

  const graph = graphOf({
    'src/orders/Order.ts': "import { Invoice } from '../billing/Invoice';\nimport { Money } from '../shared/Money';\nexport class Order {}",
    'src/orders/OrderLine.ts': "import { Money } from '../shared/Money';\nimport { Order } from './Order';\nexport class OrderLine {}",
    'src/billing/Invoice.ts': "import { Order } from '../orders/Order';\nimport { Money } from '../shared/Money';\nexport class Invoice {}",
    'src/billing/Payment.ts': "import { Invoice } from './Invoice';\nexport class Payment {}",
    'src/shared/Money.ts': 'export class Money {}',
    'src/audit/Audit.ts': "import { Outside } from '../../lib/Outside';\nexport class Audit {}",
    'lib/Outside.ts': 'export class Outside {}',
  });

  it('should have a node for every slice, with the slices it depends on', () => {
    expect(graph.toAdjacency()).toEqual(
      new Map([
        ['audit', []],
        ['billing', ['orders', 'shared']],
        ['orders', ['billing', 'shared']],
        ['shared', []],
      ])
    );
  });

  it('should list the dependencies between two slices', () => {
    expect(graph.dependenciesBetween('orders', 'shared').map(dependency => dependency.getDescription())).toEqual([
      'src.shared.Money.ts in src.orders.Order.ts',
      'src.shared.Money.ts in src.orders.OrderLine.ts',
    ]);
  });

  it('should ignore dependencies inside a slice', () => {
    expect(graph.dependenciesBetween('orders', 'orders')).toEqual([]);
    expect(graph.dependenciesBetween('billing', 'billing')).toEqual([]);
  });

  it('should ignore dependencies on classes that belong to no slice', () => {
    expect(graph.toAdjacency().get('audit')).toEqual([]);
  });

  it('should have no dependency between slices that do not depend on each other', () => {
    expect(graph.dependenciesBetween('shared', 'orders')).toEqual([]);
    expect(graph.dependenciesBetween('unknown', 'orders')).toEqual([]);
  });
});
