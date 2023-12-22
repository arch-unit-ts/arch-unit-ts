import { RelativePath } from '../../../../main/arch-unit/core/domain/RelativePath';
import { TypeScriptProject } from '../../../../main/arch-unit/core/domain/TypeScriptProject';
import { ArchRuleDefinition } from '../../../../main/arch-unit/lang/synthax/ArchRuleDefinition';
import { Architectures } from '../../../../main/arch-unit/library/Architectures';
import { BusinessContext } from '../../../hexagonal/BusinessContext';
import { SharedKernel } from '../../../hexagonal/SharedKernel';
import { TypeScriptProjectFixture } from '../arch-unit/core/domain/TypeScriptProjectFixture';

describe('HexagonalArchTest', () => {
  function packagesWithContext(contextName: string): string[] {
    const archProject = TypeScriptProjectFixture.fakeSrc();
    return archProject
      .filterClasses('**/package-info.ts')
      .filter(typeScriptClass => typeScriptClass.hasImport(contextName))
      .map(typeScriptClass => typeScriptClass.packagePath.getDotsPath());
  }

  const sharedKernels = packagesWithContext(SharedKernel.name);
  const businessContexts = packagesWithContext(BusinessContext.name);
  const businessContextOne = RelativePath.of('src/test/fake-src/business-context-one');
  const businessContextTwo = RelativePath.of('src/test/fake-src/business-context-two');
  const archProjectBusinessOne = new TypeScriptProject(businessContextOne);
  const archProjectBusinessTwo = new TypeScriptProject(businessContextTwo);

  describe('BoundedContexts', () => {
    describe('shouldNotDependOnOtherBoundedContextDomainsChargement', () => {
      it('Should not depend on other bounded context domains', () => {
        expect(() =>
          ArchRuleDefinition.noClasses()
            .that()
            .resideInAnyPackage(businessContextOne.getDotsPath() + '..')
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(...otherBusinessContextsDomains(businessContextOne.getDotsPath()))
            .because('Contexts can only depend on classes in the same context or shared kernels')
            .check(archProjectBusinessOne.allClasses())
        ).not.toThrow();
      });

      it('Should fail when depend on other bounded context domains', () => {
        expect(() =>
          ArchRuleDefinition.noClasses()
            .that()
            .resideInAnyPackage(businessContextTwo.getDotsPath() + '..')
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(...otherBusinessContextsDomains(businessContextTwo.getDotsPath()))
            .because('Contexts can only depend on classes in the same context or shared kernels')
            .check(archProjectBusinessTwo.allClasses())
        ).toThrow(
          "Architecture violation : Rule no classes reside in any package 'src.test.fake-src.business-context-two..' should depend on classes that reside in any package 'src.test.fake-src.business-context-one.domain..' because Contexts can only depend on classes in the same context or shared kernels.\n" +
            'Errors : Dependency src.test.fake-src.business-context-one.domain.fruit.Fruit.ts in src.test.fake-src.business-context-two.domain.Basket.ts'
        );
      });

      describe('shouldBeAnHexagonalArchitecture', () => {
        it('Should fail when not an hexagonal architecture', () => {
          const businessContextTwoDotsPath = 'src.test.fake-src.business-context-two';
          expect(() =>
            Architectures.layeredArchitecture()
              .consideringOnlyDependenciesInAnyPackage(businessContextTwoDotsPath)
              .withOptionalLayers(true)
              .layer('domain models', `${businessContextTwoDotsPath}.domain..`)
              .layer('domain services', `${businessContextTwoDotsPath}.domain..`)
              .layer('application services', `${businessContextTwoDotsPath}.application..`)
              .layer('primary adapters', `${businessContextTwoDotsPath}.infrastructure.primary..`)
              .layer('secondary adapters', `${businessContextTwoDotsPath}.infrastructure.secondary..`)
              .whereLayer('application services')
              .mayOnlyBeAccessedByLayers('primary adapters')
              .whereLayer('primary adapters')
              .mayNotBeAccessedByAnyLayer()
              .whereLayer('secondary adapters')
              .mayNotBeAccessedByAnyLayer()
              .because('Each bounded context should implement an hexagonal architecture')
              .check(archProjectBusinessTwo.allClasses())
          ).toThrow(
            "Architecture violation : Rule Layered architecture considering only dependencies in any package ['src.test.fake-src.business-context-two'], consisting of (optional)\n" +
              "layer 'domain models' (reside in any package 'src.test.fake-src.business-context-two.domain..')\n" +
              "layer 'domain services' (reside in any package 'src.test.fake-src.business-context-two.domain..')\n" +
              "layer 'application services' (reside in any package 'src.test.fake-src.business-context-two.application..')\n" +
              "layer 'primary adapters' (reside in any package 'src.test.fake-src.business-context-two.infrastructure.primary..')\n" +
              "layer 'secondary adapters' (reside in any package 'src.test.fake-src.business-context-two.infrastructure.secondary..')\n" +
              "where layer 'application services' may only be accessed by layers ['primary adapters']\n" +
              "where layer 'primary adapters' may not be accessed by any layer\n" +
              "where layer 'secondary adapters' may not be accessed by any layer because Each bounded context should implement an hexagonal architecture.\n" +
              'Errors : Dependency src.test.fake-src.business-context-two.application.BasketApplicationService.ts in src.test.fake-src.business-context-two.infrastructure.secondary.BasketJson.ts\n' +
              'Dependency src.test.fake-src.business-context-two.infrastructure.primary.Supplier.ts in src.test.fake-src.business-context-two.application.BasketApplicationService.ts\n' +
              'Dependency src.test.fake-src.business-context-two.infrastructure.primary.Supplier.ts in src.test.fake-src.business-context-two.infrastructure.secondary.BasketJson.ts\n' +
              'Dependency src.test.fake-src.business-context-two.infrastructure.secondary.BasketJson.ts in src.test.fake-src.business-context-two.domain.Basket.ts\n' +
              'Dependency src.test.fake-src.business-context-two.infrastructure.secondary.BasketJson.ts in src.test.fake-src.business-context-two.infrastructure.primary.Supplier.ts'
          );
        });
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
            "Architecture violation : Rule classes reside in a package 'domain' should only depend on classes that reside in any package 'domain', 'src.test.fake-src.shared-kernel-one' because Domain model should only depend on domains and a very limited set of external dependencies.\n" +
              'Errors : Dependency src.test.fake-src.business-context-two.infrastructure.secondary.BasketJson.ts in src.test.fake-src.business-context-two.domain.Basket.ts'
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
              .resideInAPackage('infrastructure.primary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage('infrastructure.secondary')
              .because('Primary should not interact with secondary')
              .check(archProjectBusinessTwo.allClasses());
          }).toThrow(
            "Architecture violation : Rule no classes reside in a package 'infrastructure.primary' should depend on classes that reside in a package 'infrastructure.secondary' because Primary should not interact with secondary.\n" +
              'Errors : Dependency src.test.fake-src.business-context-two.infrastructure.secondary.BasketJson.ts in src.test.fake-src.business-context-two.infrastructure.primary.Supplier.ts'
          );
        });
        it('should succeed because primary depends on secondary', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage('infrastructure.primary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage('infrastructure.secondary')
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
              .resideInAPackage('infrastructure.secondary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage('application')
              .because('Secondary should not depend on application')
              .check(archProjectBusinessTwo.allClasses());
          }).toThrow(
            "Architecture violation : Rule no classes reside in a package 'infrastructure.secondary' should depend on classes that reside in a package 'application' because Secondary should not depend on application.\n" +
              'Errors : Dependency src.test.fake-src.business-context-two.application.BasketApplicationService.ts in src.test.fake-src.business-context-two.infrastructure.secondary.BasketJson.ts'
          );
        });
        it('should not depend on application', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage('infrastructure.secondary')
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
              .resideInAPackage(businessContextTwo.getDotsPath() + '.infrastructure.secondary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage(businessContextTwo.getDotsPath() + '.infrastructure.primary')
              .because("Secondary should not loop to its own context's primary")
              .check(archProjectBusinessTwo.allClasses());
          }).toThrow(
            "Architecture violation : Rule no classes reside in a package 'src.test.fake-src.business-context-two.infrastructure.secondary' should depend on classes that reside in a package 'src.test.fake-src.business-context-two.infrastructure.primary' because Secondary should not loop to its own context's primary.\n" +
              'Errors : Dependency src.test.fake-src.business-context-two.infrastructure.primary.Supplier.ts in src.test.fake-src.business-context-two.infrastructure.secondary.BasketJson.ts'
          );
        });
        it('should not depend on same context primary', () => {
          expect(() => {
            ArchRuleDefinition.noClasses()
              .that()
              .resideInAPackage(businessContextOne.getDotsPath() + '.infrastructure.secondary')
              .should()
              .dependOnClassesThat()
              .resideInAPackage(businessContextOne.getDotsPath() + '.infrastructure.primary')
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
            .resideInAPackage(businessContextOne.getDotsPath() + '.application')
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(businessContextOne.getDotsPath() + '.infrastructure')
            .because('Application should not depend on infrastructure')
            .check(archProjectBusinessOne.allClasses());
        }).not.toThrow();
      });
      it('should fail when depend on infrastructure', () => {
        expect(() => {
          ArchRuleDefinition.noClasses()
            .that()
            .resideInAPackage(businessContextTwo.getDotsPath() + '.application')
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(businessContextTwo.getDotsPath() + '.infrastructure')
            .because('Application should not depend on infrastructure')
            .check(archProjectBusinessTwo.allClasses());
        }).toThrow(
          "Architecture violation : Rule no classes reside in a package 'src.test.fake-src.business-context-two.application' should depend on classes that reside in any package 'src.test.fake-src.business-context-two.infrastructure' because Application should not depend on infrastructure.\n" +
            'Errors : Dependency src.test.fake-src.business-context-two.infrastructure.primary.Supplier.ts in src.test.fake-src.business-context-two.application.BasketApplicationService.ts'
        );
      });
    });

    function otherBusinessContextsDomains(context: string): string[] {
      return businessContexts.filter(other => context !== other).map(name => name + '.domain..');
    }
  });
});
