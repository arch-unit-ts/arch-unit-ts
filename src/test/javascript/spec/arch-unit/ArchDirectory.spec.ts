import { Project } from 'ts-morph';

import { ArchDirectory } from '@/arch-unit/domain/ArchDirectory';

describe('ArchDirectory', () => {
  it('Should filterFilesByName', () => {
    const tsMorphProject = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    tsMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');

    const tsMorphRootDirectory = tsMorphProject.getDirectory('src/test/fake-src');

    const directory = new ArchDirectory(tsMorphRootDirectory);
    const files = directory.filterFilesByName('package-info');

    expect(files[0].name).toEqual('package-info.ts');
    expect(files[0].directory.get()).toEqual('business-context-one');

    expect(files[1].name).toEqual('package-info.ts');
    expect(files[1].directory.get()).toEqual('business-context-two');

    expect(files[2].name).toEqual('package-info.ts');
    expect(files[2].directory.get()).toEqual('shared-kernel-one');
  });
});
