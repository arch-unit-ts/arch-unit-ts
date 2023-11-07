import { classes } from '@/arch-unit/domain/fluentapi/ArchRuleDefinition';
import { Path } from '@/arch-unit/domain/Path';
import { TypeScriptProject } from '@/arch-unit/domain/TypeScriptProject';

describe('ArchRuleDefinition', () => {
  describe('shouldNotDependOnOutside', () => {
    it('should Not Depend On Outside', () => {
      const archProject = new TypeScriptProject(Path.of('src/test/fake-src/business-context-one'));

      expect(() =>
        classes()
          .that()
          .resideInAPackage('domain')
          .should()
          .onlyDependOnClassesThat()
          .resideInAPackage('domain')
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
          .resideInAPackage('domain')
          .because('Domain model should only depend on domains and a very limited set of external dependencies')
          .check(archProject.get().allClasses())
      ).toThrow(
        'Architecture violation : Domain model should only depend on domains and a very limited set of external dependencies.\n' +
          'Errors : Wrong dependency in /src/test/fake-src/business-context-two/domain/Basket.ts: /src/test/fake-src/business-context-two/infrastructure/secondary/BasketJson.ts'
      );
    });
  });
});
