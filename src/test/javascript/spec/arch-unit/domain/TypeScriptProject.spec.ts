import { Path } from '../../../../../main/arch-unit/domain/Path';
import { TypeScriptProject } from '../../../../../main/arch-unit/domain/TypeScriptProject';

describe('TypeScriptProject', () => {
  it('Should throw when folder does not exist', () => {
    expect(() => new TypeScriptProject(Path.of('not/a/valid/root/package'))).toThrow('The package not/a/valid/root/package was not found');
  });

  describe('containsExactly', () => {
    it('Should contain exactly', () => {
      const archProject = new TypeScriptProject(Path.of('src/test/fake-src'));
      expect(archProject.get().containsExactly(['business-context-one', 'business-context-two', 'shared-kernel-one'])).toBe(true);
    });

    it('Should be false with wrong directories', () => {
      const archProject = new TypeScriptProject(Path.of('src/test/fake-src'));
      expect(archProject.get().containsExactly(['bananes'])).toBe(false);
    });
  });
});
