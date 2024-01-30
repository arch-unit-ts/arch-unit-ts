import { Assert } from '../../error/domain/Assert';
import { ArchConfiguration } from '../ArchConfiguration';

import { AllowEmptyShouldType } from './AllowEmptyShouldType';

export class AllowEmptyShould {
  private readonly type: AllowEmptyShouldType;

  constructor(type: AllowEmptyShouldType) {
    Assert.notNullOrUndefined('type', type);
    this.type = type;
  }

  static fromBoolean(allow: boolean): AllowEmptyShould {
    return new AllowEmptyShould(allow ? AllowEmptyShouldType.TRUE : AllowEmptyShouldType.FALSE);
  }

  static asConfigured(): AllowEmptyShould {
    return new AllowEmptyShould(AllowEmptyShouldType.AS_CONFIGURED);
  }

  isAllowed(): boolean {
    switch (this.type) {
      case AllowEmptyShouldType.TRUE:
        return true;
      case AllowEmptyShouldType.FALSE:
        return false;
      case AllowEmptyShouldType.AS_CONFIGURED:
        return !ArchConfiguration.get().failOnEmptyShould;
    }
  }
}
