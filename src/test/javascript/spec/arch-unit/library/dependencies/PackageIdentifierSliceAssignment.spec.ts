import { TypeScriptClass } from '../../../../../../main/arch-unit/core/domain/TypeScriptClass';
import { PackageIdentifierSliceAssignment } from '../../../../../../main/arch-unit/library/dependencies/PackageIdentifierSliceAssignment';
import { InMemoryTypeScriptClassesFixture } from '../../morph/InMemoryTypeScriptClassesFixture';

describe('PackageIdentifierSliceAssignment', () => {
  const classOf = (path: string): TypeScriptClass => InMemoryTypeScriptClassesFixture.fromSources({ [path]: 'export class A {}' }).get()[0];

  it('should have a description with the package identifier', () => {
    expect(new PackageIdentifierSliceAssignment('..src.(*)..').getDescription()).toEqual("slices matching '..src.(*)..'");
  });

  it('should identify the slice with the captured package', () => {
    const identifier = new PackageIdentifierSliceAssignment('src.(*)..').getIdentifierOf(classOf('src/billing/domain/Invoice.ts'));

    expect(identifier.orElseThrow().getName()).toEqual('billing');
  });

  it('should keep the whole kebab-case package name', () => {
    const identifier = new PackageIdentifierSliceAssignment('src.(*)..').getIdentifierOf(classOf('src/order-mgmt/Order.ts'));

    expect(identifier.orElseThrow().getName()).toEqual('order-mgmt');
  });

  it('should identify the slice with every captured group', () => {
    const identifier = new PackageIdentifierSliceAssignment('src.(*).(*)').getIdentifierOf(classOf('src/billing/domain/Invoice.ts'));

    expect(identifier.orElseThrow().getParts()).toEqual(['billing', 'domain']);
  });

  it('should not assign a class when the whole package does not match', () => {
    const assignment = new PackageIdentifierSliceAssignment('src.(*)');

    expect(assignment.getIdentifierOf(classOf('src/billing/domain/Invoice.ts')).isEmpty()).toEqual(true);
    expect(assignment.getIdentifierOf(classOf('lib/billing/Invoice.ts')).isEmpty()).toEqual(true);
  });

  it('should reject a package identifier without capturing group', () => {
    expect(() => new PackageIdentifierSliceAssignment('src..domain..')).toThrow(
      "Package identifier 'src..domain..' must contain at least one capturing group '(*)' or '(**)' to define slices"
    );
  });

  it('should reject an invalid package identifier', () => {
    expect(() => new PackageIdentifierSliceAssignment('src....(*)')).toThrow(
      "Package Identifier may not contain more than two '.' in a row"
    );
  });
});
