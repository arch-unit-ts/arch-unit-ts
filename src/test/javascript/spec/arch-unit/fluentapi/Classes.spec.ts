import { TypeScriptProject } from '../../../../../main/arch-unit/domain/TypeScriptProject';

import { classes } from '@/arch-unit/domain/fluentapi/Classes';
import { Path } from '@/arch-unit/domain/Path';

describe('Classes', () => {
  it('Should have valid domain dependencies', () => {
    const archProject = new TypeScriptProject(Path.of('src/test/fake-src/business-context-one'));

    expect(() =>
      classes()
        .that()
        .resideInAPackage('domain')
        .should()
        .onlyHaveDependentClassesThat()
        .from('domain')
        .because('Domain model should only depend on himself')
        .check(archProject)
    ).not.toThrow();
  });

  it('Should have invalid domain dependencies', () => {
    const archProject = new TypeScriptProject(Path.of('src/test/fake-src/business-context-two'));

    expect(() =>
      classes()
        .that()
        .resideInAPackage('domain')
        .should()
        .onlyHaveDependentClassesThat()
        .from('domain')
        .because('Domain model should only depend on himself')
        .check(archProject)
    ).toThrow('Domain model should only depend on himself');
  });
});
