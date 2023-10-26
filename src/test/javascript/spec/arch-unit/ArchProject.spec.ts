import { ArchProject } from '@/arch-unit/domain/ArchProject';
import { Path } from '@/arch-unit/domain/Path';

describe('ArchProject', () => {
  it('Should throw when folder does not exist', () => {
    expect(() => new ArchProject(Path.of('not/a/valid/root/package'))).toThrow('The directory not/a/valid/root/package was not found');
  });

  describe('containsExactly', () => {
    it('Should contain exactly', () => {
      const archProject = new ArchProject(Path.of('src/test/fake-src'));
      expect(archProject.get().containsExactly(['business-context-one', 'business-context-two', 'shared-kernel-one'])).toBe(true);
    });

    it('Should be false with wrong directories', () => {
      const archProject = new ArchProject(Path.of('src/test/fake-src'));
      expect(archProject.get().containsExactly(['bananes'])).toBe(false);
    });
  });
});
