import { ArchRuleDefinition } from '../../../../../../main/arch-unit/domain/fluentapi/ArchRuleDefinition';
import { BusinessContext } from '../../../../../../main/arch-unit/domain/hexagonal/BusinessContext';
import { SharedKernel } from '../../../../../../main/arch-unit/domain/hexagonal/SharedKernel';
import { RelativePath } from '../../../../../../main/arch-unit/domain/RelativePath';
import { TypeScriptProject } from '../../../../../../main/arch-unit/domain/TypeScriptProject';
import { TypeScriptProjectFixture } from '../TypeScriptProjectFixture';

describe('HexagonalArchTest', () => {
  function packagesWithContext(contextName: string): string[] {
    const archProject = TypeScriptProjectFixture.fakeSrc();
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
        const archProject = new TypeScriptProject(RelativePath.of(businessContextOne));

        expect(() =>
          ArchRuleDefinition.noClasses()
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
        const archProject = new TypeScriptProject(RelativePath.of(businessContextTwo));
        expect(() =>
          ArchRuleDefinition.noClasses()
            .that()
            .resideInAnyPackage(businessContextTwo)
            .should()
            .onlyDependOnClassesThat()
            .resideInAnyPackage(...otherBusinessContextsDomains(businessContextTwo))
            .because('Contexts can only depend on classes in the same context or shared kernels')
            .check(archProject.get().allClasses())
        ).toThrow(
          'Architecture violation : Contexts can only depend on classes in the same context or shared kernels.\n' +
            'Errors : Wrong dependency in src/test/fake-src/business-context-two/domain/Basket.ts: src/test/fake-src/business-context-one/domain/fruit/Fruit.ts'
        );
      });
    });

    describe('Domain', () => {
      describe('shouldNotDependOnOutside', () => {
        it('Should not depend on outside', () => {
          const archProject = new TypeScriptProject(RelativePath.of('src/test/fake-src/business-context-one'));

          expect(() =>
            ArchRuleDefinition.classes()
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
          const archProject = new TypeScriptProject(RelativePath.of('src/test/fake-src/business-context-two'));

          expect(() =>
            ArchRuleDefinition.classes()
              .that()
              .resideInAPackage('domain')
              .should()
              .onlyDependOnClassesThat()
              .resideInAnyPackage('domain', ...sharedKernels)
              .because('Domain model should only depend on domains and a very limited set of external dependencies')
              .check(archProject.get().allClasses())
          ).toThrow(
            'Architecture violation : Domain model should only depend on domains and a very limited set of external dependencies.\n' +
              'Errors : Wrong dependency in src/test/fake-src/business-context-two/domain/Basket.ts: src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts'
          );
        });
      });
    });

    describe('Primary', () => {
      const archProjectBusinessTwo = new TypeScriptProject(RelativePath.of('src/test/fake-src/business-context-two'));
      const archProjectBusinessOne = new TypeScriptProject(RelativePath.of('src/test/fake-src/business-context-one'));
      describe('should not depend on secondary', () => {
        it('should fail when primary depends on secondary', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage('infrastructure/primary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage('infrastructure/secondary')
              .because('Primary should not interact with secondary')
              .check(archProjectBusinessTwo.get().allClasses());
          }).toThrow(
            'Wrong dependency in src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts: src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts'
          );
        });
        it('should succeed because primary depends on secondary', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage('infrastructure/primary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage('infrastructure/secondary')
              .because('Primary should not interact with secondary')
              .check(archProjectBusinessOne.get().allClasses());
          }).not.toThrow();
        });
      });
    });

    describe('Secondary', () => {
      const archProjectBusinessTwo = new TypeScriptProject(RelativePath.of('src/test/fake-src/business-context-two'));
      const archProjectBusinessOne = new TypeScriptProject(RelativePath.of('src/test/fake-src/business-context-one'));
      describe('shouldNotDependOnApplication', () => {
        it('should fail when depend on application', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage('infrastructure/secondary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage('application')
              .because('Secondary should not depend on application')
              .check(archProjectBusinessTwo.get().allClasses());
          }).toThrow(
            'Architecture violation : Secondary should not depend on application.\n' +
              'Errors : Wrong dependency in src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts: src/test/fake-src/business-context-two/application/Service.ts'
          );
        });
        it('should not depend on application', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage('infrastructure/secondary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage('application')
              .because('Secondary should not depend on application')
              .check(archProjectBusinessOne.get().allClasses());
          }).not.toThrow();
        });
      });
      describe('shouldNotDependOnSameContextPrimary', () => {
        it('should fail when depend on same context primary', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage(archProjectBusinessTwo.get().name.get() + '/infrastructure/secondary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage(archProjectBusinessTwo.get().name.get() + '/infrastructure/primary')
              .because("Secondary should not loop to its own context's primary")
              .check(archProjectBusinessTwo.get().allClasses());
          }).toThrow(
            "Architecture violation : Secondary should not loop to its own context's primary.\n" +
              'Errors : Wrong dependency in src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts: src/test/fake-src/business-context-two/application/Service.ts\n' +
              'Wrong dependency in src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts: src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts'
          );
        });
        it('should not depend on same context primary', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage(archProjectBusinessOne.get().name.get() + '/infrastructure/secondary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage(archProjectBusinessOne.get().name.get() + '/infrastructure/primary')
              .because("Secondary should not loop to its own context's primary")
              .check(archProjectBusinessOne.get().allClasses());
          }).not.toThrow();
        });
      });
    });

    function otherBusinessContextsDomains(context: string): string[] {
      return businessContexts.filter(other => context !== other).map(name => name + '/domain');
    }
  });
});
