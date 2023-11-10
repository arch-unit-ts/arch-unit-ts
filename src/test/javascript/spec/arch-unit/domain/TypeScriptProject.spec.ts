import { RelativePath } from '../../../../../main/arch-unit/domain/RelativePath';
import { TypeScriptProject } from '../../../../../main/arch-unit/domain/TypeScriptProject';

import { TypeScriptProjectFixture } from './TypeScriptProjectFixture';

describe('TypeScriptProject', () => {
  it('Should throw when folder does not exist', () => {
    expect(() => new TypeScriptProject(RelativePath.of('not/a/valid/root/package'))).toThrow(
      'The package not/a/valid/root/package was not found'
    );
  });

  describe('containsExactly', () => {
    const archProject = TypeScriptProjectFixture.fakeSrc();
    it('Should contain exactly', () => {
      expect(archProject.get().containsExactly(['business-context-one', 'business-context-two', 'shared-kernel-one'])).toBe(true);
    });

    it('Should be false with wrong directories', () => {
      expect(archProject.get().containsExactly(['bananes'])).toBe(false);
    });
  });
});
