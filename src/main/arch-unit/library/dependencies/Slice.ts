import { HasDescription } from '../../base/HasDescription';
import { TypeScriptClass } from '../../core/domain/TypeScriptClass';

import { SliceIdentifier } from './SliceIdentifier';

export class Slice implements HasDescription {
  readonly identifier: SliceIdentifier;
  readonly classes: TypeScriptClass[];

  constructor(identifier: SliceIdentifier, classes: TypeScriptClass[]) {
    this.identifier = identifier;
    this.classes = classes;
  }

  getName(): string {
    return this.identifier.getName();
  }

  getDescription(): string {
    return `Slice ${this.getName()}`;
  }
}
