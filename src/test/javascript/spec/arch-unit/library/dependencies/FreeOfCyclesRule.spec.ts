import { FreeOfCyclesRule } from '../../../../../../main/arch-unit/library/dependencies/FreeOfCyclesRule';
import { PackageIdentifierSliceAssignment } from '../../../../../../main/arch-unit/library/dependencies/PackageIdentifierSliceAssignment';
import { InMemoryTypeScriptClassesFixture } from '../../morph/InMemoryTypeScriptClassesFixture';

describe('FreeOfCyclesRule', () => {
  const rule = (): FreeOfCyclesRule => new FreeOfCyclesRule(new PackageIdentifierSliceAssignment('src.(*)..'));

  const billingAndOrdersCycle = {
    'src/billing/Invoice.ts': "import { Order } from '../orders/Order';\nexport class Invoice {}",
    'src/orders/Order.ts': "import { Invoice } from '../billing/Invoice';\nexport class Order {}",
  };

  it('should be described by its slices and its reason', () => {
    expect(rule().getDescription()).toEqual("slices matching 'src.(*)..' should be free of cycles");
    expect(rule().because('slices are independent').getDescription()).toEqual(
      "slices matching 'src.(*)..' should be free of cycles because slices are independent"
    );
  });

  it('should have no error when slices do not depend on each other in a cycle', () => {
    const classes = InMemoryTypeScriptClassesFixture.fromSources({
      'src/billing/Invoice.ts': "import { Order } from '../orders/Order';\nexport class Invoice {}",
      'src/orders/Order.ts': 'export class Order {}',
    });

    expect(rule().evaluate(classes).hasErrors()).toEqual(false);
    expect(() => rule().check(classes)).not.toThrow();
  });

  it('should not report dependencies inside a slice, even circular', () => {
    const classes = InMemoryTypeScriptClassesFixture.fromSources({
      'src/billing/Invoice.ts': "import { Payment } from './Payment';\nexport class Invoice {}",
      'src/billing/Payment.ts': "import { Invoice } from './Invoice';\nexport class Payment {}",
    });

    expect(rule().evaluate(classes).hasErrors()).toEqual(false);
  });

  it('should report the cycle with the dependencies that cause it', () => {
    const classes = InMemoryTypeScriptClassesFixture.fromSources(billingAndOrdersCycle);

    expect(() => rule().check(classes)).toThrow(
      new Error(
        "Architecture violation : Rule slices matching 'src.(*)..' should be free of cycles.\n" +
          'Errors : Cycle detected: billing -> orders -> billing\n' +
          '  Dependencies of Slice billing on Slice orders:\n' +
          '    - src.orders.Order.ts in src.billing.Invoice.ts\n' +
          '  Dependencies of Slice orders on Slice billing:\n' +
          '    - src.billing.Invoice.ts in src.orders.Order.ts'
      )
    );
  });

  it('should give the reason in the error', () => {
    const classes = InMemoryTypeScriptClassesFixture.fromSources(billingAndOrdersCycle);

    expect(() => rule().because('billing and orders must be independent').check(classes)).toThrow(
      "Architecture violation : Rule slices matching 'src.(*)..' should be free of cycles because billing and orders must be independent.\n"
    );
  });

  it('should report every cycle, shortest first', () => {
    const classes = InMemoryTypeScriptClassesFixture.fromSources({
      'src/a/A.ts': "import { B } from '../b/B';\nexport class A {}",
      'src/b/B.ts': "import { C } from '../c/C';\nexport class B {}",
      'src/c/C.ts': "import { A } from '../a/A';\nimport { D } from '../d/D';\nexport class C {}",
      'src/d/D.ts': "import { C } from '../c/C';\nexport class D {}",
    });
    const report = rule().evaluate(classes);

    expect(report.violationReport()).toContain('Cycle detected: c -> d -> c');
    expect(report.violationReport()).toContain('Cycle detected: a -> b -> c -> a');
    expect(report.violationReport().indexOf('c -> d -> c')).toBeLessThan(report.violationReport().indexOf('a -> b -> c -> a'));
  });

  it('should limit the number of dependencies reported for each edge of a cycle', () => {
    const sources: Record<string, string> = {
      'src/orders/Order.ts': "import { Invoice00 } from '../billing/Invoice00';\nexport class Order {}",
    };
    for (let index = 0; index < FreeOfCyclesRule.MAX_NUMBER_OF_DEPENDENCIES_PER_EDGE + 2; index++) {
      const name = `Invoice${String(index).padStart(2, '0')}`;
      sources[`src/billing/${name}.ts`] = `import { Order } from '../orders/Order';\nexport class ${name} {}`;
    }
    const report = rule().evaluate(InMemoryTypeScriptClassesFixture.fromSources(sources)).violationReport();

    expect(report).toContain('    - ... and 2 more');
    expect(report.match(/ in src\.billing\.Invoice\d\d\.ts/g)).toHaveLength(FreeOfCyclesRule.MAX_NUMBER_OF_DEPENDENCIES_PER_EDGE);
  });

  it('should limit the number of reported cycles', () => {
    const slices = ['a', 'b', 'c', 'd', 'e', 'f'];
    const sources: Record<string, string> = {};
    slices.forEach(slice => {
      const imports = slices
        .filter(other => other !== slice)
        .map(other => `import { ${other.toUpperCase()} } from '../${other}/${other.toUpperCase()}';`)
        .join('\n');
      sources[`src/${slice}/${slice.toUpperCase()}.ts`] = `${imports}\nexport class ${slice.toUpperCase()} {}`;
    });
    const report = rule().evaluate(InMemoryTypeScriptClassesFixture.fromSources(sources)).violationReport();

    expect(report.match(/Cycle detected/g)).toHaveLength(FreeOfCyclesRule.MAX_NUMBER_OF_CYCLES);
    expect(report).toContain(
      `Only the first ${FreeOfCyclesRule.MAX_NUMBER_OF_CYCLES} cycles are reported, more cycles exist between these slices`
    );
  });

  describe('when no class is assigned to a slice', () => {
    const classes = InMemoryTypeScriptClassesFixture.fromSources({ 'lib/Outside.ts': 'export class Outside {}' });

    it('should fail when empty is not allowed', () => {
      expect(() => rule().allowEmptyShould(false).evaluate(classes)).toThrow(
        "Rule 'slices matching 'src.(*)..' should be free of cycles' failed to check any slices. " +
          'This means either that no classes have been passed to the rule at all, ' +
          'or that no classes passed to the rule were assigned to a slice. ' +
          "To allow rules being evaluated without checking any slices you can use '.allowEmptyShould(true)' on a single rule or use the default configuration."
      );
    });

    it('should pass when empty is allowed', () => {
      expect(rule().allowEmptyShould(true).evaluate(classes).hasErrors()).toEqual(false);
    });

    it('should keep the reason when allowing empty', () => {
      expect(rule().because('a reason').allowEmptyShould(false).getDescription()).toContain('because a reason');
    });
  });
});
