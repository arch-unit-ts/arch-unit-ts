import { TypeScriptClass } from '../../../../main/arch-unit/core/domain/TypeScriptClass';
import { PackageIdentifierSliceAssignment } from '../../../../main/arch-unit/library/dependencies/PackageIdentifierSliceAssignment';
import { SliceAssignment } from '../../../../main/arch-unit/library/dependencies/SliceAssignment';
import { SliceIdentifier } from '../../../../main/arch-unit/library/dependencies/SliceIdentifier';
import { Slices } from '../../../../main/arch-unit/library/dependencies/Slices';
import { SlicesRuleDefinition } from '../../../../main/arch-unit/library/dependencies/SlicesRuleDefinition';
import { Optional } from '../../../../main/common/domain/Optional';
import { TypeScriptProjectFixture } from '../arch-unit/core/domain/TypeScriptProjectFixture';
import { InMemoryTypeScriptClassesFixture } from '../arch-unit/morph/InMemoryTypeScriptClassesFixture';

describe('SlicesFluentApi', () => {
  const cyclicClasses = InMemoryTypeScriptClassesFixture.fromSources({
    'src/billing/Invoice.ts': "import { Order } from '../orders/Order';\nexport class Invoice {}",
    'src/orders/Order.ts': "import { Invoice } from '../billing/Invoice';\nexport class Order {}",
  });

  it('should pass on a project whose slices are free of cycles, with kebab-case package names', () => {
    expect(() =>
      SlicesRuleDefinition.slices()
        .matching('..fake-src.(*)..')
        .should()
        .beFreeOfCycles()
        .allowEmptyShould(false)
        .check(TypeScriptProjectFixture.fakeSrc().allClasses())
    ).not.toThrow();
  });

  it('should name the slices of a project after its whole kebab-case packages', () => {
    const slices = Slices.of(TypeScriptProjectFixture.fakeSrc().allClasses(), new PackageIdentifierSliceAssignment('..fake-src.(*)..'));

    expect(slices.getSlices().map(slice => slice.getName())).toEqual([
      'business-context-one',
      'business-context-two',
      'shared-kernel-one',
      'transactional',
    ]);
  });

  it('should fail with the cycle when slices matching a package identifier depend on each other', () => {
    expect(() =>
      SlicesRuleDefinition.slices()
        .matching('src.(*)..')
        .should()
        .beFreeOfCycles()
        .because('bounded contexts are independent')
        .check(cyclicClasses)
    ).toThrow(
      "Architecture violation : Rule slices matching 'src.(*)..' should be free of cycles because bounded contexts are independent.\n" +
        'Errors : Cycle detected: billing -> orders -> billing'
    );
  });

  it('should reject a package identifier without capturing group', () => {
    expect(() => SlicesRuleDefinition.slices().matching('src..')).toThrow(
      "Package identifier 'src..' must contain at least one capturing group '(*)' or '(**)' to define slices"
    );
  });

  it('should fail when slices assigned from a custom assignment depend on each other', () => {
    const byClassName: SliceAssignment = {
      getIdentifierOf: (typeScriptClass: TypeScriptClass): Optional<SliceIdentifier> =>
        Optional.of(SliceIdentifier.of(typeScriptClass.getSimpleName())),
      getDescription: () => 'slices by class name',
    };

    expect(() => SlicesRuleDefinition.slices().assignedFrom(byClassName).should().beFreeOfCycles().check(cyclicClasses)).toThrow(
      'Architecture violation : Rule slices by class name should be free of cycles.\n' +
        'Errors : Cycle detected: Invoice.ts -> Order.ts -> Invoice.ts'
    );
  });

  it('should detect a cycle with an assignment that relies on the source file of the classes', () => {
    const bySourceFileName: SliceAssignment = {
      getIdentifierOf: (typeScriptClass: TypeScriptClass): Optional<SliceIdentifier> =>
        Optional.of(SliceIdentifier.of(typeScriptClass.getSourceFile()!.getBaseNameWithoutExtension())),
      getDescription: () => 'slices by source file name',
    };

    expect(() => SlicesRuleDefinition.slices().assignedFrom(bySourceFileName).should().beFreeOfCycles().check(cyclicClasses)).toThrow(
      'Errors : Cycle detected: Invoice -> Order -> Invoice'
    );
  });
});
