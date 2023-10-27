import { Path } from '../../../../../main/arch-unit/domain/Path';
import { TypeScriptProject } from '../../../../../main/arch-unit/domain/TypeScriptProject';

import { layeredArchitecture } from '@/arch-unit/domain/fluentapi/Architecture';

describe('Architecture', () => {
  it('Should not throw', () => {
    const archProject = new TypeScriptProject(Path.of('src/test/fake-src'));

    const context = 'business-context-two';
    expect(() => {
      layeredArchitecture()
        .consideringOnlyDependenciesInAnyPackage(context)
        .layer('domain')
        .definedBy(context + '/domain/**')
        .because('Each context should have a domain')
        .check(archProject);
    }).not.toThrow();
  });

  it('Should throw because wrong architecture', () => {
    const archProject = new TypeScriptProject(Path.of('src/test/fake-src'));

    const context = 'business-context-one';
    expect(() => {
      layeredArchitecture()
        .consideringOnlyDependenciesInAnyPackage(context)
        .layer('domain')
        .definedBy(context + '/domain/**')
        .layer('primary adapter')
        .definedBy(context + '/non-existing-folder/**')
        .because('Each bounded context should implement an hexagonal architecture')
        .check(archProject);
    }).toThrow('Each bounded context should implement an hexagonal architecture');
  });
});
