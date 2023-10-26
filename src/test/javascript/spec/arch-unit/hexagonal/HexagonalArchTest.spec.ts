import { ArchProject } from '@/arch-unit/domain/ArchProject';
import { DirectoryName } from '@/arch-unit/domain/DirectoryName';
import { BusinessContext } from '@/arch-unit/domain/hexagonal/BusinessContext';
import { SharedKernel } from '@/arch-unit/domain/hexagonal/SharedKernel';
import { Path } from '@/arch-unit/domain/Path';

describe('HexagonalArchTest', () => {
  it('Should get shared kernels', () => {
    expect(packagesWithContext(SharedKernel.name).map(directory => directory.get())).toEqual(['shared-kernel-one']);
  });

  it('Should get business context', () => {
    expect(packagesWithContext(BusinessContext.name).map(directory => directory.get())).toEqual([
      'business-context-one',
      'business-context-two',
    ]);
  });
});

function packagesWithContext(contextName: string): DirectoryName[] {
  const archProject = new ArchProject(Path.of('src/test/fake-src'));
  return archProject
    .get()
    .filterFilesByName('package-info')
    .filter(file => file.hasImport(contextName))
    .map(file => file.directory);
}
