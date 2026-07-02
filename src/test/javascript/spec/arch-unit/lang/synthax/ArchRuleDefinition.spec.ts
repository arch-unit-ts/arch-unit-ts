import { ArchRuleDefinition } from '../../../../../../main/arch-unit/lang/synthax/ArchRuleDefinition';
import { GivenClassesInternal } from '../../../../../../main/arch-unit/lang/synthax/GivenClassesInternal';
import { GivenMethodsInternal } from '../../../../../../main/arch-unit/lang/synthax/GivenMethodsInternal';

describe('ArchRuleDefinition', () => {
  describe('classes', () => {
    it('should build GivenClassesInternal', () => {
      const givenClassesInternal: GivenClassesInternal = ArchRuleDefinition.classes();

      expect(givenClassesInternal).not.toBeNull();
    });
  });

  describe('noClasses', () => {
    it('should build GivenClassesInternal', () => {
      const givenClassesInternal: GivenClassesInternal = ArchRuleDefinition.noClasses();

      expect(givenClassesInternal).not.toBeNull();
    });
  });

  describe('methods', () => {
    it('should build GivenMethodsInternal', () => {
      const givenMethodsInternal: GivenMethodsInternal = ArchRuleDefinition.methods();

      expect(givenMethodsInternal).not.toBeNull();
    });
  });

  describe('noMethods', () => {
    it('should build GivenMethodsInternal', () => {
      const givenMethodsInternal: GivenMethodsInternal = ArchRuleDefinition.noMethods();

      expect(givenMethodsInternal).not.toBeNull();
    });
  });
});
