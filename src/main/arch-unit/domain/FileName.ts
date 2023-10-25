import { Assert } from '@/error/domain/Assert';

export class FileName {
  private readonly fileName: string;

  constructor(fileName: string) {
    Assert.notBlank('fileName', fileName);
    this.fileName = fileName.trim();
  }

  static of(fileName: string): FileName {
    return new FileName(fileName);
  }

  get(): string {
    return this.fileName;
  }
}
