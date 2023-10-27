import { BusinessContext } from '@/arch-unit/domain/hexagonal/BusinessContext';
import { SharedKernel } from '@/arch-unit/domain/hexagonal/SharedKernel';
import { PackageName } from '@/arch-unit/domain/PackageName';
import { Path } from '@/arch-unit/domain/Path';
import { TypeScriptProject } from '@/arch-unit/domain/TypeScriptProject';

describe('HexagonalTypeScriptTest', () => {
  it('Should get shared kernels', () => {
    expect(packagesWithContext(SharedKernel.name).map(packageName => packageName.get())).toEqual(['shared-kernel-one']);
  });

  it('Should get business context', () => {
    expect(packagesWithContext(BusinessContext.name).map(packageName => packageName.get())).toEqual([
      'business-context-one',
      'business-context-two',
    ]);
  });
});

function packagesWithContext(contextName: string): PackageName[] {
  const archProject = new TypeScriptProject(Path.of('src/test/fake-src'));
  return archProject
    .get()
    .filterClassesByName('package-info')
    .filter(typeScriptClass => typeScriptClass.hasImport(contextName))
    .map(typeScriptClass => typeScriptClass.packageName);
}
