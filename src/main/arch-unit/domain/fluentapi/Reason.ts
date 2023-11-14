import { Assert } from '../../../error/domain/Assert';

export class Reason {
  private readonly reason: string;

  private constructor(reason: string) {
    Assert.notBlank('reason', reason);
    this.reason = reason.trim();
  }

  get(): string {
    return this.reason;
  }

  static of(reason: string): Reason {
    return new Reason(reason);
  }
}
