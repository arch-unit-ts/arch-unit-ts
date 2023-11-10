import { RelativePath } from './src/main/arch-unit/domain/RelativePath';
import { TypeScriptProject } from './src/main/arch-unit/domain/TypeScriptProject';

declare module 'vitest' {
  export interface ProvidedContext {
    fakeSrcProject: TypeScriptProject;
  }
}

export default function setup({ provide }) {
  console.log('COUCOU');

  provide('fakeSrcProject', new TypeScriptProject(RelativePath.of('src/test/fake-src')));
}
