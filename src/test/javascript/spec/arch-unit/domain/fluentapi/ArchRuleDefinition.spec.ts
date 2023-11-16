import { ArchRuleDefinition } from '../../../../../../main/arch-unit/domain/fluentapi/ArchRuleDefinition';
import { GivenClassesInternal } from '../../../../../../main/arch-unit/domain/fluentapi/GivenClassesInternal';

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
