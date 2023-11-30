import { ArchRuleDefinition } from '../../../../../../main/arch-unit/lang/synthax/ArchRuleDefinition';
import { GivenClassesInternal } from '../../../../../../main/arch-unit/lang/synthax/GivenClassesInternal';

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
});
