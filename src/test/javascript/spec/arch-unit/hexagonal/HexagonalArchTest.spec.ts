import { BusinessContext } from '@/arch-unit/domain/hexagonal/BusinessContext';
import { SharedKernel } from '@/arch-unit/domain/hexagonal/SharedKernel';
import { Path } from '@/arch-unit/domain/Path';
import { TypeScriptProject } from '@/arch-unit/domain/TypeScriptProject';

describe('HexagonalTypeScriptTest', () => {
  it('Should get shared kernels', () => {
    expect(packagesWithContext(SharedKernel.name).map(packagePath => packagePath.get())).toEqual(['/src/test/fake-src/shared-kernel-one']);
  });

  it('Should get business context', () => {
    expect(packagesWithContext(BusinessContext.name).map(packagePath => packagePath.get())).toEqual([
      '/src/test/fake-src/business-context-one',
      '/src/test/fake-src/business-context-two',
    ]);
  });
});

function packagesWithContext(contextName: string): Path[] {
  const archProject = new TypeScriptProject(Path.of('src/test/fake-src'));
  return archProject
    .get()
    .filterClassesByName('package-info')
    .filter(typeScriptClass => typeScriptClass.hasImport(contextName))
    .map(typeScriptClass => typeScriptClass.packagePath);
}
