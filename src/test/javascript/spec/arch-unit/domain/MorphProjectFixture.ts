import { Project } from 'ts-morph';

export class MorphProjectFixture {
  static fakeSrc = (): Project => {
    const fakeSrcMorphProject = new Project({
      tsConfigFilePath: 'tsconfig.json',
    });
    fakeSrcMorphProject.addSourceFilesAtPaths('src/test/fake-src/**/*.ts');
    return fakeSrcMorphProject;
  };
}
