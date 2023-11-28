import { ArchRuleDefinition } from '../../../../main/arch-unit/domain/fluentapi/ArchRuleDefinition';
import { BusinessContext } from '../../../../main/arch-unit/domain/hexagonal/BusinessContext';
import { SharedKernel } from '../../../../main/arch-unit/domain/hexagonal/SharedKernel';
import { RelativePath } from '../../../../main/arch-unit/domain/RelativePath';
import { TypeScriptProject } from '../../../../main/arch-unit/domain/TypeScriptProject';
import { TypeScriptProjectFixture } from '../arch-unit/domain/TypeScriptProjectFixture';

describe('HexagonalArchTest', () => {
  function packagesWithContext(contextName: string): string[] {
    const archProject = TypeScriptProjectFixture.fakeSrc();
    return archProject
      .filterClassesByClassName('package-info')
      .filter(typeScriptClass => typeScriptClass.hasImport(contextName))
      .map(typeScriptClass => typeScriptClass.packagePath.get());
  }

  const sharedKernels = packagesWithContext(SharedKernel.name);
  const businessContexts = packagesWithContext(BusinessContext.name);
  const businessContextOne = 'src/test/fake-src/business-context-one';
  const businessContextTwo = 'src/test/fake-src/business-context-two';
  const archProjectBusinessOne = new TypeScriptProject(RelativePath.of(businessContextOne));
  const archProjectBusinessTwo = new TypeScriptProject(RelativePath.of(businessContextTwo));

  describe('BoundedContexts', () => {
    describe('shouldNotDependOnOtherBoundedContextDomains', () => {
      it('Should not depend on other bounded context domains', () => {
        expect(() =>
          ArchRuleDefinition.noClasses()
            .that()
            .resideInAnyPackage(businessContextOne)
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(...otherBusinessContextsDomains(businessContextOne))
            .because('Contexts can only depend on classes in the same context or shared kernels')
            .check(archProjectBusinessOne.allClasses())
        ).not.toThrow();
      });

      it('Should fail when depend on other bounded context domains', () => {
        expect(() =>
          ArchRuleDefinition.noClasses()
            .that()
            .resideInAnyPackage(businessContextTwo)
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(...otherBusinessContextsDomains(businessContextTwo))
            .because('Contexts can only depend on classes in the same context or shared kernels')
            .check(archProjectBusinessTwo.allClasses())
        ).toThrow(
          "Architecture violation : Rule no classes reside in any package 'src/test/fake-src/business-context-two' should depend on classes that reside in any package 'src/test/fake-src/business-context-one/domain' because Contexts can only depend on classes in the same context or shared kernels.\n" +
            'Errors : Dependency src/test/fake-src/business-context-two/domain/Basket.ts in src/test/fake-src/business-context-one/domain/fruit/Fruit.ts'
        );
      });
    });

    describe('Domain', () => {
      describe('shouldNotDependOnOutside', () => {
        it('Should not depend on outside', () => {
          expect(() =>
            ArchRuleDefinition.classes()
              .that()
              .resideInAPackage('domain')
              .should()
              .onlyDependOnClassesThat()
              .resideInAnyPackage('domain', ...sharedKernels)
              .because('Domain model should only depend on domains and a very limited set of external dependencies')
              .check(archProjectBusinessOne.allClasses())
          ).not.toThrow();
        });

        it('Should fail when depend on outside', () => {
          expect(() =>
            ArchRuleDefinition.classes()
              .that()
              .resideInAPackage('domain')
              .should()
              .onlyDependOnClassesThat()
              .resideInAnyPackage('domain', ...sharedKernels)
              .because('Domain model should only depend on domains and a very limited set of external dependencies')
              .check(archProjectBusinessTwo.allClasses())
          ).toThrow(
            "Architecture violation : Rule classes reside in a package 'domain' should only depend on classes that reside in any package 'domain', 'src/test/fake-src/shared-kernel-one' because Domain model should only depend on domains and a very limited set of external dependencies.\n" +
              'Errors : Dependency src/test/fake-src/business-context-two/domain/Basket.ts in src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts'
          );
        });
      });
    });

    describe('Primary', () => {
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
              .check(archProjectBusinessTwo.allClasses());
          }).toThrow(
            "Architecture violation : Rule no classes reside in a package 'infrastructure/primary' should depend on classes that reside in a package 'infrastructure/secondary' because Primary should not interact with secondary.\n" +
              'Errors : Dependency src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts in src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts'
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
              .check(archProjectBusinessOne.allClasses());
          }).not.toThrow();
        });
      });
    });

    describe('Secondary', () => {
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
              .check(archProjectBusinessTwo.allClasses());
          }).toThrow(
            "Architecture violation : Rule no classes reside in a package 'infrastructure/secondary' should depend on classes that reside in a package 'application' because Secondary should not depend on application.\n" +
              'Errors : Dependency src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts in src/test/fake-src/business-context-two/application/BasketApplicationService.ts'
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
              .check(archProjectBusinessOne.allClasses());
          }).not.toThrow();
        });
      });
      describe('shouldNotDependOnSameContextPrimary', () => {
        it('should fail when depend on same context primary', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage(businessContextTwo + '/infrastructure/secondary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage(businessContextTwo + '/infrastructure/primary')
              .because("Secondary should not loop to its own context's primary")
              .check(archProjectBusinessTwo.allClasses());
          }).toThrow(
            "Architecture violation : Rule no classes reside in a package 'src/test/fake-src/business-context-two/infrastructure/secondary' should depend on classes that reside in a package 'src/test/fake-src/business-context-two/infrastructure/primary' because Secondary should not loop to its own context's primary.\n" +
              'Errors : Dependency src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts in src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts'
          );
        });
        it('should not depend on same context primary', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage(businessContextOne + '/infrastructure/secondary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage(businessContextOne + '/infrastructure/primary')
              .because("Secondary should not loop to its own context's primary")
              .check(archProjectBusinessOne.allClasses());
          }).not.toThrow();
        });
      });
    });

    describe('Application', () => {
      it('shouldNotDependOnInfrastructure', () => {
        expect(() => {
          ArchRuleDefinition.noClasses()
            .that()
            .resideInAPackage(businessContextOne + '/application')
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(businessContextOne + '/infrastructure')
            .because('Application should not depend on infrastructure')
            .check(archProjectBusinessOne.allClasses());
        }).not.toThrow();
      });
      it('should fail when depend on infrastructure', () => {
        expect(() => {
          ArchRuleDefinition.noClasses()
            .that()
            .resideInAPackage(businessContextTwo + '/application')
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(businessContextTwo + '/infrastructure')
            .because('Application should not depend on infrastructure')
            .check(archProjectBusinessTwo.allClasses());
        }).toThrow(
          "Architecture violation : Rule no classes reside in a package 'src/test/fake-src/business-context-two/application' should depend on classes that reside in any package 'src/test/fake-src/business-context-two/infrastructure' because Application should not depend on infrastructure.\n" +
            'Errors : Dependency src/test/fake-src/business-context-two/application/BasketApplicationService.ts in src/test/fake-src/business-context-two/infrastructure/primary/Supplier.ts'
        );
      });
    });

    function otherBusinessContextsDomains(context: string): string[] {
      return businessContexts.filter(other => context !== other).map(name => name + '/domain');
    }
  });
});