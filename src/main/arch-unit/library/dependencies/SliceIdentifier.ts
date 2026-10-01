import { Assert } from '../../../error/domain/Assert';

export class SliceIdentifier {
  private static readonly SEPARATOR: string = '.';

  private readonly parts: string[];

  private constructor(parts: string[]) {
    Assert.notEmpty('parts', parts);
    this.parts = parts;
  }

  static of(...parts: string[]): SliceIdentifier {
    return new SliceIdentifier(parts);
  }

  getParts(): string[] {
    return [...this.parts];
  }

  getName(): string {
    return this.parts.join(SliceIdentifier.SEPARATOR);
  }
}
