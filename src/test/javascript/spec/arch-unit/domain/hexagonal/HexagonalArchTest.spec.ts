import { classes, noClasses } from '../../../../../../main/arch-unit/domain/fluentapi/ArchRuleDefinition';
import { BusinessContext } from '../../../../../../main/arch-unit/domain/hexagonal/BusinessContext';
import { SharedKernel } from '../../../../../../main/arch-unit/domain/hexagonal/SharedKernel';
import { Path } from '../../../../../../main/arch-unit/domain/Path';
import { TypeScriptProject } from '../../../../../../main/arch-unit/domain/TypeScriptProject';

describe('HexagonalArchTest', () => {
  function packagesWithContext(contextName: string): string[] {
    const archProject = new TypeScriptProject(Path.of('src/test/fake-src'));
    return archProject
      .get()
      .filterClassesByClassName('package-info')
      .filter(typeScriptClass => typeScriptClass.hasImport(contextName))
      .map(typeScriptClass => typeScriptClass.packagePath.get());
  }

  const sharedKernels = packagesWithContext(SharedKernel.name);
  const businessContexts = packagesWithContext(BusinessContext.name);

  describe('BoundedContexts', () => {
    describe('shouldNotDependOnOtherBoundedContextDomains', () => {
      it('Should not depend on other bounded context domains', () => {
        const businessContextOne = 'src/test/fake-src/business-context-one';
        const archProject = new TypeScriptProject(Path.of(businessContextOne));

        expect(() =>
          noClasses()
            .that()
            .resideInAnyPackage(businessContextOne)
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(...otherBusinessContextsDomains(businessContextOne))
            .because('Contexts can only depend on classes in the same context or shared kernels')
            .check(archProject.get().allClasses())
        ).not.toThrow();
      });

      it('Should fail when depend on other bounded context domains', () => {
        const businessContextTwo = 'src/test/fake-src/business-context-two';
        const archProject = new TypeScriptProject(Path.of(businessContextTwo));
        expect(() =>
          noClasses()
            .that()
            .resideInAnyPackage(businessContextTwo)
            .should()
            .onlyDependOnClassesThat()
            .resideInAnyPackage(...otherBusinessContextsDomains(businessContextTwo))
            .because('Contexts can only depend on classes in the same context or shared kernels')
            .check(archProject.get().allClasses())
        ).toThrow(
          'Architecture violation : Contexts can only depend on classes in the same context or shared kernels.\n' +
            'Errors : Wrong dependency in /src/test/fake-src/business-context-two/domain/Basket.ts: /src/test/fake-src/business-context-one/domain/fruit/Fruit.ts'
        );
      });
    });

    function otherBusinessContextsDomains(context: string): string[] {
      return businessContexts.filter(other => context !== other).map(name => name + '/domain');
    }
  });

  describe('Domain', () => {
    describe('shouldNotDependOnOutside', () => {
      it('Should not depend on outside', () => {
        const archProject = new TypeScriptProject(Path.of('src/test/fake-src/business-context-one'));

        expect(() =>
          classes()
            .that()
            .resideInAPackage('domain')
            .should()
            .onlyDependOnClassesThat()
            .resideInAnyPackage('domain', ...sharedKernels)
            .because('Domain model should only depend on domains and a very limited set of external dependencies')
            .check(archProject.get().allClasses())
        ).not.toThrow();
      });

      it('Should fail when depend on outside', () => {
        const archProject = new TypeScriptProject(Path.of('src/test/fake-src/business-context-two'));

        expect(() =>
          classes()
            .that()
            .resideInAPackage('domain')
            .should()
            .onlyDependOnClassesThat()
            .resideInAnyPackage('domain', ...sharedKernels)
            .because('Domain model should only depend on domains and a very limited set of external dependencies')
            .check(archProject.get().allClasses())
        ).toThrow(
          'Architecture violation : Domain model should only depend on domains and a very limited set of external dependencies.\n' +
            'Errors : Wrong dependency in /src/test/fake-src/business-context-two/domain/Basket.ts: /src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts'
        );
      });
    });
  });
});
