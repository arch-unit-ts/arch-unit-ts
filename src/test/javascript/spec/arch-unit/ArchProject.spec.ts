import { ArchProject } from '../../../../main/arch-unit/domain/ArchProject';

describe('ArchProject', () => {
  it('Should throw when folder does not exist', () => {
    expect(() => new ArchProject('not/a/valid/root/package')).toThrow('The directory not/a/valid/root/package was not found');
  });

  describe('containsExactly', () => {
    it('Should contain exactly', () => {
      const archProject = new ArchProject('src/test/fake-src');
      expect(archProject.get().containsExactly(['architecture-unit', 'common-unit', 'error-unit'])).toBe(true);
    });

    it('Should be false with wrong directories', () => {
      const archProject = new ArchProject('src/main');
      expect(archProject.get().containsExactly(['common'])).toBe(false);
    });
  });
});
