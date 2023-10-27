import { layeredArchitecture } from '@/arch-unit/domain/fluentapi/Architecture';
import { BusinessContext } from '@/arch-unit/domain/hexagonal/BusinessContext';
import { SharedKernel } from '@/arch-unit/domain/hexagonal/SharedKernel';
import { PackageName } from '@/arch-unit/domain/PackageName';
import { Path } from '@/arch-unit/domain/Path';
import { TypeScriptProject } from '@/arch-unit/domain/TypeScriptProject';

describe('HexagonalTypeScriptTest', () => {
  describe('Contexts', () => {
    it('Should get shared kernels', () => {
      expect(packagesWithContext(SharedKernel.name).map(packageName => packageName.get())).toEqual(['shared-kernel-one']);
    });

    it('Should get business context', () => {
      expect(packagesWithContext(BusinessContext.name).map(packageName => packageName.get())).toEqual([
        'business-context-one',
        'business-context-two',
      ]);
    });

    function packagesWithContext(contextName: string): PackageName[] {
      const archProject = new TypeScriptProject(Path.of('src/test/fake-src'));
      return archProject
        .get()
        .filterClassesByName('package-info')
        .filter(typeScriptClass => typeScriptClass.hasImport(contextName))
        .map(typeScriptClass => typeScriptClass.packageName);
    }
  });

  describe('Architecture', () => {
    it('Should be Hexagonal architecture', () => {
      const archProject = new TypeScriptProject(Path.of('src/test/fake-src'));

      const context = 'business-context-one';
      expect(() => {
        layeredArchitecture()
          .consideringOnlyDependenciesInAnyPackage(context)
          .layer('domain')
          .definedBy(context + '/domain/**')
          .layer('primary adapter')
          .definedBy(context + '/infrastructure/primary/**')
          .layer('secondary adapter')
          .definedBy(context + '/infrastructure/secondary/**')
          .layer('application services')
          .definedBy(context + '/application/**')
          .because('Each bounded context should implement an hexagonal architecture')
          .check(archProject);
      }).not.toThrow();
    });

    it('Should be Hexagonal architecture', () => {
      const archProject = new TypeScriptProject(Path.of('src/test/fake-src'));

      const context = 'business-context-two';
      expect(() => {
        layeredArchitecture()
          .consideringOnlyDependenciesInAnyPackage(context)
          .layer('domain')
          .definedBy(context + '/domain/**')
          .layer('primary adapter')
          .definedBy(context + '/infrastructure/primary/**')
          .layer('secondary adapter')
          .definedBy(context + '/infrastructure/secondary/**')
          .layer('application services')
          .definedBy(context + '/application/**')
          .because('Each bounded context should implement an hexagonal architecture')
          .check(archProject);
      }).toThrow('Each bounded context should implement an hexagonal architecture');
    });
  });
});
