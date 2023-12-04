import { RelativePath } from '../../../../../../main/arch-unit/core/domain/RelativePath';
import { TypeScriptProject } from '../../../../../../main/arch-unit/core/domain/TypeScriptProject';

export class TypeScriptProjectFixture {
  static fakeSrc = (): TypeScriptProject => {
    return new TypeScriptProject(RelativePath.of('src/test/fake-src'), '**/*NotToInclude.ts');
  };
}
