import { SourceFile } from 'ts-morph';

import { Path } from '../../../../../main/arch-unit/domain/Path';
import { EMPTY_STRINGS } from '../../fixture.config';

import { MorphProjectFixture } from './MorphProjectFixture';

function getSourceFile(fileName: string): SourceFile {
  return MorphProjectFixture.fakeSrc().getSourceFile(fileName);
}

describe('Path', () => {
  it.each([undefined, null])('should not build for %s', blank => {
    expect(() => Path.of(blank)).toThrow('path should not be null');
  });

  it.each(EMPTY_STRINGS)('should not build for "%s"', blank => {
    expect(() => Path.of(blank)).toThrow('path should not be blank');
  });

  it.each(['\\src\\apple', 'src/', 'src/ba+nana'])('should not build when not a path (%s)', blank => {
    expect(() => Path.of(blank)).toThrow('path should be a path');
  });

  it('should trim', () => {
    expect(Path.of(' /src/bananas \n  ').get()).toEqual('/src/bananas');
  });

  describe('contains', () => {
    it('should contains', () => {
      expect(Path.of(' /src/bananas/Bananas.ts').contains('Bananas')).toEqual(true);
    });
    it('should not contains', () => {
      expect(Path.of(' /src/bananas/Banana.ts').contains('Apple.ts')).toEqual(false);
    });
  });

  it('should remove source folder path', () => {
    const sourceFile = getSourceFile('Fruit.ts');

    expect(Path.of(sourceFile.getFilePath()).get()).toEqual('/src/test/fake-src/business-context-one/domain/fruit/Fruit.ts');
  });
});
