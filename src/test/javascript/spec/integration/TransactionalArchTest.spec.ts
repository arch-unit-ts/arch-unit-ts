import { RelativePath } from '../../../../main/arch-unit/core/domain/RelativePath';
import { TypeScriptProject } from '../../../../main/arch-unit/core/domain/TypeScriptProject';
import { ArchRuleDefinition } from '../../../../main/arch-unit/lang/synthax/ArchRuleDefinition';

describe('TransactionalArchTest', () => {
  const transactionalProject = new TypeScriptProject(RelativePath.of('src/test/fake-src/transactional'));
  const allClasses = transactionalProject.allClasses();

  describe('applicationServiceShouldHaveTransactionalOnPublicMethods', () => {
    const rule = () =>
      ArchRuleDefinition.methods()
        .that()
        .arePublic()
        .and()
        .areDeclaredInClassesThat()
        .resideInAnyPackage('..application..')
        .and()
        .areDeclaredInClassesThat()
        .haveSimpleNameEndingWith('ApplicationService.ts')
        .and()
        .areNotAbstract()
        .should()
        .beDecoratedWith('Transactional')
        .orShould()
        .beDecoratedWith('NotTransactional')
        .orShould()
        .beDeclaredInClassesThat()
        .areDecoratedWith('Transactional')
        .orShould()
        .beDeclaredInClassesThat()
        .areDecoratedWith('NotTransactional')
        .allowEmptyShould(true);

    it('should pass for fully compliant project', () => {
      const compliantProject = new TypeScriptProject(RelativePath.of('src/test/fake-src/transactional'), '**/NonCompliant*.ts');

      expect(() => rule().check(compliantProject.allClasses())).not.toThrow();
    });

    it('should fail when a service has a public method without @Transactional or @NotTransactional', () => {
      expect(() => rule().check(allClasses)).toThrow('Architecture violation');
    });

    it('should include violation details in error message', () => {
      expect(() => rule().check(allClasses)).toThrow('NonCompliantApplicationService.ts');
    });
  });

  describe('noMethods', () => {
    it('should fail when a method matches the condition (inverted rule)', () => {
      expect(() =>
        ArchRuleDefinition.noMethods()
          .that()
          .areDeclaredInClassesThat()
          .haveSimpleNameEndingWith('ApplicationService.ts')
          .should()
          .beDecoratedWith('Transactional')
          .allowEmptyShould(true)
          .check(allClasses)
      ).toThrow('Architecture violation');
    });

    it('should pass when no method matches the condition', () => {
      expect(() =>
        ArchRuleDefinition.noMethods()
          .that()
          .areDeclaredInClassesThat()
          .haveSimpleNameEndingWith('NonExistentClass.ts')
          .should()
          .beDecoratedWith('Transactional')
          .allowEmptyShould(true)
          .check(allClasses)
      ).not.toThrow();
    });
  });

  describe('allowEmptyShould', () => {
    it('should throw when no methods found and allowEmptyShould is false', () => {
      expect(() =>
        ArchRuleDefinition.methods()
          .that()
          .areDeclaredInClassesThat()
          .haveSimpleNameEndingWith('DoesNotExist.ts')
          .should()
          .beDecoratedWith('Transactional')
          .allowEmptyShould(false)
          .because('allowEmptyShould is false')
          .check(allClasses)
      ).toThrow("Rule 'allowEmptyShould is false' failed to check any methods");
    });

    it('should not throw when no methods found and allowEmptyShould is true', () => {
      expect(() =>
        ArchRuleDefinition.methods()
          .that()
          .areDeclaredInClassesThat()
          .haveSimpleNameEndingWith('DoesNotExist.ts')
          .should()
          .beDecoratedWith('Transactional')
          .allowEmptyShould(true)
          .check(allClasses)
      ).not.toThrow();
    });
  });

  describe('because', () => {
    it('should include reason in violation error message', () => {
      expect(() =>
        ArchRuleDefinition.methods()
          .that()
          .areDeclaredInClassesThat()
          .haveSimpleNameEndingWith('NonCompliantApplicationService.ts')
          .should()
          .beDecoratedWith('Transactional')
          .allowEmptyShould(true)
          .because('all service methods must be transactional')
          .check(allClasses)
      ).toThrow('because all service methods must be transactional');
    });
  });

  describe('andShould', () => {
    it('should combine conditions with AND', () => {
      expect(() =>
        ArchRuleDefinition.methods()
          .that()
          .areDeclaredInClassesThat()
          .haveSimpleNameEndingWith('MethodTransactionalApplicationService.ts')
          .should()
          .beDecoratedWith('Transactional')
          .andShould()
          .beDecoratedWith('NonExistentDecorator')
          .allowEmptyShould(true)
          .check(allClasses)
      ).toThrow('Architecture violation');
    });
  });

  describe('or predicate combinator', () => {
    it('should support OR combination in that() clause', () => {
      expect(() =>
        ArchRuleDefinition.methods()
          .that()
          .arePublic()
          .or()
          .areNotAbstract()
          .should()
          .beDecoratedWith('NonExistentDecorator')
          .allowEmptyShould(true)
          .check(allClasses)
      ).toThrow('Architecture violation');
    });
  });

  describe('beDeclaredInClassesThat with resideInAnyPackage', () => {
    it('should work with class package predicate in should clause', () => {
      expect(() =>
        ArchRuleDefinition.methods()
          .that()
          .areDeclaredInClassesThat()
          .resideInAnyPackage('..application..')
          .should()
          .beDeclaredInClassesThat()
          .resideInAnyPackage('..application..')
          .allowEmptyShould(true)
          .check(allClasses)
      ).not.toThrow();
    });
  });
});
