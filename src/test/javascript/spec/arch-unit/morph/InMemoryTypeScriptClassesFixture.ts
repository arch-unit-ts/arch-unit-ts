import * as path from 'path';

import { Project } from 'ts-morph';

import { TypeScriptClass, TypeScriptClasses } from '../../../../../main/arch-unit/core/domain/TypeScriptClass';

export class InMemoryTypeScriptClassesFixture {
  /**
   * Builds classes from in-memory sources, so that tests can describe any dependency graph
   * (including circular ones) without adding files that would be seen by the repository's own madge check.
   * Keys are paths relative to the working directory, like the real project's classes.
   */
  static fromSources(sources: Record<string, string>): TypeScriptClasses {
    const project = new Project({ useInMemoryFileSystem: true });
    Object.entries(sources).forEach(([relativePath, content]) => project.createSourceFile(path.resolve(relativePath), content));

    return new TypeScriptClasses(project.getSourceFiles().map(sourceFile => TypeScriptClass.of(sourceFile)));
  }
}
