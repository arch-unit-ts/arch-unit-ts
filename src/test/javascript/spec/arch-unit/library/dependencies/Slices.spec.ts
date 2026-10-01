import { TypeScriptClass } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { PackageIdentifierSliceAssignment } from '../../../../../../main/arch-unit/library/dependencies/PackageIdentifierSliceAssignment';
import { Slices } from '../../../../../../main/arch-unit/library/dependencies/Slices';
import { InMemoryTypeScriptClassesFixture } from '../../morph/InMemoryTypeScriptClassesFixture';

describe('Slices', () => {
  const classes = InMemoryTypeScriptClassesFixture.fromSources({
    'src/orders/Order.ts': "import { Invoice } from '../billing/Invoice';\nexport class Order { invoice?: Invoice }",
    'src/billing/Invoice.ts': 'export class Invoice {}',
    'src/billing/Payment.ts': 'export class Payment {}',
    'src/shared/Money.ts': 'export class Money {}',
    'lib/Outside.ts': 'export class Outside {}',
  });
  const slices = Slices.of(classes, new PackageIdentifierSliceAssignment('src.(*)'));

  const classNamed = (name: string): TypeScriptClass => classes.get().find(typeScriptClass => typeScriptClass.getSimpleName() === name)!;

  it('should read the dependencies of in-memory sources like the real ones', () => {
    expect(classNamed('Order.ts').dependencies.map(dependency => dependency.getDescription())).toEqual([
      'src.billing.Invoice.ts in src.orders.Order.ts',
    ]);
  });

  it('should group classes by slice sorted by name', () => {
    expect(slices.getSlices().map(slice => slice.getName())).toEqual(['billing', 'orders', 'shared']);
    expect(
      slices
        .getSlices()[0]
        .classes.map(typeScriptClass => typeScriptClass.getSimpleName())
        .sort()
    ).toEqual(['Invoice.ts', 'Payment.ts']);
  });

  it('should ignore classes outside of any slice', () => {
    const allSliceClasses = slices.getSlices().flatMap(slice => slice.classes);

    expect(allSliceClasses).not.toContain(classNamed('Outside.ts'));
  });

  it('should describe a slice', () => {
    expect(slices.getSlices()[0].getDescription()).toEqual('Slice billing');
  });

  it('should find the slice of a class', () => {
    expect(slices.sliceOf(classNamed('Payment.ts')).orElseThrow().getName()).toEqual('billing');
  });

  it('should find the slice of a dependency target without source file', () => {
    const dependencyTarget = classNamed('Order.ts').dependencies[0].typeScriptClass;

    expect(slices.sliceOf(dependencyTarget).orElseThrow().getName()).toEqual('billing');
  });

  it('should not find a slice for a class outside of any slice', () => {
    expect(slices.sliceOf(classNamed('Outside.ts')).isEmpty()).toEqual(true);
  });

  it('should not find a slice with no class for an identifier', () => {
    const slicesWithoutBilling = Slices.of(
      InMemoryTypeScriptClassesFixture.fromSources({ 'src/orders/Order.ts': 'export class Order {}' }),
      new PackageIdentifierSliceAssignment('src.(*)')
    );

    expect(slicesWithoutBilling.sliceOf(classNamed('Payment.ts')).isEmpty()).toEqual(true);
  });

  it('should be empty when no class is assigned', () => {
    const noSlices = Slices.of(classes, new PackageIdentifierSliceAssignment('nothing.(*)'));

    expect(noSlices.isEmpty()).toEqual(true);
    expect(slices.isEmpty()).toEqual(false);
  });

  it('should be described by its assignment', () => {
    expect(slices.getDescription()).toEqual("slices matching 'src.(*)'");
  });
});
