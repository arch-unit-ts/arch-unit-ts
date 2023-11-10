import { describe } from 'vitest';

import { TypeScriptProjectFixture } from '../TypeScriptProjectFixture';

import { classes, noClasses } from '@/arch-unit/domain/fluentapi/ArchRuleDefinition';
import { BusinessContext } from '@/arch-unit/domain/hexagonal/BusinessContext';
import { SharedKernel } from '@/arch-unit/domain/hexagonal/SharedKernel';
import { RelativePath } from '@/arch-unit/domain/RelativePath';
import { TypeScriptProject } from '@/arch-unit/domain/TypeScriptProject';

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

        console.log('FAKE SRC 2', TypeScriptProjectFixture.fakeSrc2());
        const classes = TypeScriptProjectFixture.fakeSrc2().get().filterClassesByPackageIdentifier(businessContextOne);

        expect(() =>
          noClasses()
            .that()
            .resideInAnyPackage(businessContextOne)
            .should()
            .dependOnClassesThat()
            .resideInAnyPackage(...otherBusinessContextsDomains(businessContextOne))
            .because('Contexts can only depend on classes in the same context or shared kernels')
            .check(classes)
        ).not.toThrow();
      });

      it('Should fail when depend on other bounded context domains', () => {
        const businessContextTwo = 'src/test/fake-src/business-context-two';
        const archProject = new TypeScriptProject(RelativePath.of(businessContextTwo));
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
            'Errors : Wrong dependency in src/test/fake-src/business-context-two/domain/Basket.ts: src/test/fake-src/business-context-one/domain/fruit/Fruit.ts'
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
        const archProject = new TypeScriptProject(RelativePath.of('src/test/fake-src/business-context-one'));

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
        const archProject = new TypeScriptProject(RelativePath.of('src/test/fake-src/business-context-two'));

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
            'Errors : Wrong dependency in src/test/fake-src/business-context-two/domain/Basket.ts: src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts'
        );
      });
    });
  });
});
