import { Assert } from '../../error/domain/Assert';

export class AllowEmptyShould {
  private readonly allow: boolean;

  constructor(allow: boolean) {
    Assert.notNullOrUndefined('allow', allow);
    this.allow = allow;
  }

  static of(allow: boolean): AllowEmptyShould {
    return new AllowEmptyShould(allow);
  }

  static default(): AllowEmptyShould {
    return AllowEmptyShould.of(true);
  }

  isAllowed(): boolean {
    return this.allow;
  }
}
