import { SourceFile } from 'ts-morph';

import { RelativePath } from '../../../../../main/arch-unit/domain/RelativePath';
import { EMPTY_STRINGS } from '../../fixture.config';

import { MorphProjectFixture } from './MorphProjectFixture';

function getSourceFile(fileName: string): SourceFile {
  return MorphProjectFixture.fakeSrc().getSourceFile(fileName);
}

describe('Path', () => {
  it.each([undefined, null])('should not build for %s', blank => {
    expect(() => RelativePath.of(blank)).toThrow('path should not be null');
  });

  it.each(EMPTY_STRINGS)('should not build for "%s"', blank => {
    expect(() => RelativePath.of(blank)).toThrow('path should not be blank');
  });

  it.each(['\\src\\apple', 'src/', 'src/ba+nana'])('should not build when not a path (%s)', blank => {
    expect(() => RelativePath.of(blank)).toThrow('path should be a path');
  });

  it('should trim', () => {
    expect(RelativePath.of('src/bananas \n  ').get()).toEqual('src/bananas');
  });

  describe('contains', () => {
    it('should contains', () => {
      expect(RelativePath.of('src/bananas/Bananas.ts').contains('Bananas')).toEqual(true);
    });
    it('should not contains', () => {
      expect(RelativePath.of('src/bananas/Banana.ts').contains('Apple.ts')).toEqual(false);
    });
  });

  it('should remove source folder path', () => {
    const sourceFile = getSourceFile('Fruit.ts');

    expect(RelativePath.of(sourceFile.getFilePath()).get()).toEqual('src/test/fake-src/business-context-one/domain/fruit/Fruit.ts');
  });
});
