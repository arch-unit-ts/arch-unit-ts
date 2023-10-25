import { DirectoryName } from '@/arch-unit/domain/DirectoryName';

describe('FolderName', () => {
  it.each([undefined, null])('should not build for null or undefined', blank => {
    expect(() => DirectoryName.of(blank)).toThrow('directoryName should not be null');
  });

  it.each(['', ' ', '\t\n'])('should not build for blank', blank => {
    expect(() => DirectoryName.of(blank)).toThrow('directoryName should not be blank');
  });
});
