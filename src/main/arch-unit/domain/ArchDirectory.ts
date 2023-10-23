import { Directory } from 'ts-morph';

import { ArchFile } from '@/arch-unit/domain/ArchFile';
import { DirectoryName } from '@/arch-unit/domain/DirectoryName';

export class ArchDirectory {
  private readonly name: DirectoryName;
  private readonly directories: ArchDirectory[];
  private readonly files: ArchFile[];

  constructor(directory: Directory, srcPaths: string[]) {
    this.name = DirectoryName.of(directory.getBaseName());
    this.directories = directory.getDirectories().map(directory => new ArchDirectory(directory, srcPaths));
    this.files = directory.getSourceFiles().map(file => new ArchFile(file, srcPaths));
  }

  containsExactly(names: string[]): boolean {
    return !this.directories.some(folder => !names.includes(folder.name.get()));
  }
}
