import { Directory } from 'ts-morph';

import { ArchFile } from '@/arch-unit/domain/ArchFile';
import { DirectoryName } from '@/arch-unit/domain/DirectoryName';
import { Path } from '@/arch-unit/domain/Path';
import { Optional } from '@/common/domain/Optional';

export class ArchDirectory {
  readonly name: DirectoryName;
  readonly directories: ArchDirectory[];
  readonly files: ArchFile[];
  readonly path: Path;

  constructor(directory: Directory) {
    this.name = DirectoryName.of(directory.getBaseName());
    this.directories = directory.getDirectories().map(directory => new ArchDirectory(directory));
    this.files = directory.getSourceFiles().map(file => new ArchFile(file));
    this.path = Path.of(directory.getPath());
  }

  containsExactly(names: string[]): boolean {
    return !this.directories.some(folder => !names.includes(folder.name.get()));
  }

  filterFilesByName(fileName: string): ArchFile[] {
    return this.directories.flatMap(directory => directory.files.filter(file => file.name.get().includes(fileName)));
  }

  allImports(): Path[] {
    const currentDirectoryImport = this.files.flatMap(file => file.importPaths);
    const subDirectoriesImport = this.directories.flatMap(directory => directory.allImports());
    return [...currentDirectoryImport, ...subDirectoriesImport];
  }

  getDirectory(packageToCheck: DirectoryName): Optional<ArchDirectory> {
    return Optional.ofUndefinable(this.directories.find(directory => directory.name.get() === packageToCheck.get()));
  }
}
